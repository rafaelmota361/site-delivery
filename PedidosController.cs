using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using System.IO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using models.Models;

namespace models.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PedidosController : ControllerBase
    {
        // Mesmos valores do ENUM forma_pagamento no script_mysql.sql
        private static readonly string[] FormasPagamentoValidas = { "pix", "cartao_na_entrega", "dinheiro" };

        private static readonly JsonSerializerOptions OpcoesJson = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        private readonly string _connectionString;

        public PedidosController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? "Server=localhost;Database=delivery_italiano;Uid=root;Pwd=;";
        }

        // POST api/pedidos/concluir -> usado pelo checkout.js
        [HttpPost("concluir")]
        public async Task<IActionResult> Concluir([FromBody] PedidoConcluirDto dto)
        {
            using var connection = new MySqlConnection(_connectionString);
            await connection.OpenAsync();

            using var transaction = await connection.BeginTransactionAsync();
            try
            {
                var pedido = await RegistrarPedidoAsync(connection, transaction, dto);
                await transaction.CommitAsync();

                return Ok(new { sucesso = true, pedido });
            }
            catch (ArgumentException ex)
            {
                await transaction.RollbackAsync();
                return BadRequest(new { sucesso = false, mensagem = ex.Message });
            }
        }

        // POST api/pedidos/importar -> lê um arquivo .json com uma lista de pedidos e grava no MySQL
        // Envio: multipart/form-data, campo "arquivo" (exemplo: pedidos-exemplo.json)
        [HttpPost("importar")]
        public async Task<IActionResult> Importar(IFormFile arquivo)
        {
            if (arquivo == null || arquivo.Length == 0)
            {
                return BadRequest(new { sucesso = false, mensagem = "Envie um arquivo JSON não vazio." });
            }

            if (!Path.GetExtension(arquivo.FileName).Equals(".json", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest(new { sucesso = false, mensagem = "O arquivo precisa ter a extensão .json." });
            }

            List<PedidoConcluirDto> pedidos;
            try
            {
                using var stream = arquivo.OpenReadStream();
                pedidos = await JsonSerializer.DeserializeAsync<List<PedidoConcluirDto>>(stream, OpcoesJson);
            }
            catch (JsonException ex)
            {
                return BadRequest(new { sucesso = false, mensagem = $"JSON inválido: {ex.Message}" });
            }

            if (pedidos == null || pedidos.Count == 0)
            {
                return BadRequest(new { sucesso = false, mensagem = "O arquivo não contém nenhum pedido." });
            }

            var resultado = new PedidoImportacaoResultadoDto { Total = pedidos.Count };

            using var connection = new MySqlConnection(_connectionString);
            await connection.OpenAsync();

            // Cada pedido tem sua própria transação: um erro não cancela os demais
            for (int i = 0; i < pedidos.Count; i++)
            {
                using var transaction = await connection.BeginTransactionAsync();
                try
                {
                    await RegistrarPedidoAsync(connection, transaction, pedidos[i]);
                    await transaction.CommitAsync();
                    resultado.Importados++;
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    resultado.Erros.Add($"Pedido {i + 1}: {ex.Message}");
                }
            }

            return Ok(new { sucesso = true, resultado });
        }

        // Valida o pedido, busca preço e frete no MySQL e grava pedidos + itens_pedido
        private static async Task<PedidoCriadoDto> RegistrarPedidoAsync(MySqlConnection connection, MySqlTransaction transaction, PedidoConcluirDto dto)
        {
            if (dto.IdUsuario <= 0)
            {
                throw new ArgumentException("Usuário inválido.");
            }

            if (!FormasPagamentoValidas.Contains(dto.FormaPagamento))
            {
                throw new ArgumentException("Forma de pagamento inválida.");
            }

            if (dto.Itens == null || dto.Itens.Count == 0)
            {
                throw new ArgumentException("O pedido não possui itens.");
            }

            if (dto.Itens.Any(i => i.Quantidade <= 0))
            {
                throw new ArgumentException("A quantidade de cada item deve ser maior que zero.");
            }

            // O endereço precisa pertencer ao usuário; o frete vem do cadastro do endereço
            decimal frete;
            var sqlEndereco = "SELECT frete FROM enderecos WHERE id_endereco = @idEndereco AND id_usuario = @idUsuario";
            using (var cmdEndereco = new MySqlCommand(sqlEndereco, connection, transaction))
            {
                cmdEndereco.Parameters.AddWithValue("@idEndereco", dto.IdEndereco);
                cmdEndereco.Parameters.AddWithValue("@idUsuario", dto.IdUsuario);

                var valorFrete = await cmdEndereco.ExecuteScalarAsync();
                if (valorFrete == null || valorFrete == DBNull.Value)
                {
                    throw new ArgumentException("Endereço não encontrado para este usuário.");
                }

                frete = Convert.ToDecimal(valorFrete);
            }

            // Agrupa produtos repetidos (itens_pedido tem chave (id_pedido, id_produto))
            var itens = dto.Itens
                .GroupBy(i => i.IdProduto)
                .Select(g => new { IdProduto = g.Key, Quantidade = g.Sum(x => x.Quantidade) })
                .ToList();

            // O preço sempre vem do banco, nunca do cliente
            var itensComPreco = new List<(int IdProduto, int Quantidade, decimal PrecoUnitario)>();
            decimal subtotal = 0;

            foreach (var item in itens)
            {
                var sqlProduto = "SELECT preco FROM produtos WHERE id_produto = @idProduto AND ativo = 1";
                using var cmdProduto = new MySqlCommand(sqlProduto, connection, transaction);
                cmdProduto.Parameters.AddWithValue("@idProduto", item.IdProduto);

                var valorPreco = await cmdProduto.ExecuteScalarAsync();
                if (valorPreco == null || valorPreco == DBNull.Value)
                {
                    throw new ArgumentException($"Produto {item.IdProduto} não encontrado ou indisponível.");
                }

                var precoUnitario = Convert.ToDecimal(valorPreco);
                itensComPreco.Add((item.IdProduto, item.Quantidade, precoUnitario));
                subtotal += precoUnitario * item.Quantidade;
            }

            var total = subtotal + frete;

            // status não é informado: usa o padrão 'recebido' definido no banco
            long idPedido;
            var sqlPedido = @"INSERT INTO pedidos (id_usuario, id_endereco, forma_pagamento, subtotal, frete, total)
                              VALUES (@idUsuario, @idEndereco, @formaPagamento, @subtotal, @frete, @total)";
            using (var cmdPedido = new MySqlCommand(sqlPedido, connection, transaction))
            {
                cmdPedido.Parameters.AddWithValue("@idUsuario", dto.IdUsuario);
                cmdPedido.Parameters.AddWithValue("@idEndereco", dto.IdEndereco);
                cmdPedido.Parameters.AddWithValue("@formaPagamento", dto.FormaPagamento);
                cmdPedido.Parameters.AddWithValue("@subtotal", subtotal);
                cmdPedido.Parameters.AddWithValue("@frete", frete);
                cmdPedido.Parameters.AddWithValue("@total", total);

                await cmdPedido.ExecuteNonQueryAsync();
                idPedido = cmdPedido.LastInsertedId;
            }

            var sqlItem = @"INSERT INTO itens_pedido (id_pedido, id_produto, quantidade, preco_unitario)
                            VALUES (@idPedido, @idProduto, @quantidade, @precoUnitario)";
            foreach (var item in itensComPreco)
            {
                using var cmdItem = new MySqlCommand(sqlItem, connection, transaction);
                cmdItem.Parameters.AddWithValue("@idPedido", idPedido);
                cmdItem.Parameters.AddWithValue("@idProduto", item.IdProduto);
                cmdItem.Parameters.AddWithValue("@quantidade", item.Quantidade);
                cmdItem.Parameters.AddWithValue("@precoUnitario", item.PrecoUnitario);

                await cmdItem.ExecuteNonQueryAsync();
            }

            return new PedidoCriadoDto
            {
                IdPedido = (int)idPedido,
                FormaPagamento = dto.FormaPagamento,
                Status = "recebido",
                Subtotal = subtotal,
                Frete = frete,
                Total = total,
                QuantidadeItens = itensComPreco.Count
            };
        }
    }
}
