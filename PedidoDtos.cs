using System.Collections.Generic;

namespace models.Models
{
    // Item do pedido (produto e quantidade)
    public class PedidoItemDto
    {
        public int IdProduto { get; set; }
        public int Quantidade { get; set; }
    }

    // Pedido recebido do checkout (checkout.js) ou de um arquivo JSON importado
    public class PedidoConcluirDto
    {
        public int IdUsuario { get; set; }
        public int IdEndereco { get; set; }
        public string FormaPagamento { get; set; } = string.Empty;
        public List<PedidoItemDto> Itens { get; set; } = new List<PedidoItemDto>();
    }

    // Dados do pedido registrado no MySQL (usados na tela de confirmação)
    public class PedidoCriadoDto
    {
        public int IdPedido { get; set; }
        public string FormaPagamento { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public decimal Subtotal { get; set; }
        public decimal Frete { get; set; }
        public decimal Total { get; set; }
        public int QuantidadeItens { get; set; }
    }

    // Resultado da importação de um arquivo JSON com vários pedidos
    public class PedidoImportacaoResultadoDto
    {
        public int Total { get; set; }
        public int Importados { get; set; }
        public List<string> Erros { get; set; } = new List<string>();
    }
}
