using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using models.Models;
using BCrypt.Net;

namespace models.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly string _connectionString;

        public AuthController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? "Server=localhost;Database=delivery_italiano;Uid=root;Pwd=;";
        }

        [HttpPost("cadastrar")]
        public async Task<IActionResult> Cadastrar([FromBody] UsuarioCadastroDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Nome) || string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Senha))
            {
                return BadRequest(new { mensagem = "Preencha todos os campos obrigatórios." });
            }

            using var connection = new MySqlConnection(_connectionString);
            await connection.OpenAsync();

            // verificar se o email ja esta cadastrado
            var checkSql = "SELECT COUNT(*) FROM usuarios WHERE email = @email";
            using (var checkCmd = new MySqlCommand(checkSql, connection))
            {
                checkCmd.Parameters.AddWithValue("@email", dto.Email.Trim().ToLower());
                var count = Convert.ToInt32(await checkCmd.ExecuteScalarAsync());
                if (count > 0)
                {
                    return BadRequest(new { mensagem = "Este e-mail já possui cadastro na Trattoria Venezia." });
                }
            }

            // hash da senha
            string senhaHash = BCrypt.Net.BCrypt.HashPassword(dto.Senha);

            // adicionar no mysql
            var insertSql = @"INSERT INTO usuarios (nome, sobrenome, email, senha_hash, cpf, telefone) 
                              VALUES (@nome, @sobrenome, @email, @senhaHash, @cpf, @telefone)";

            using (var insertCmd = new MySqlCommand(insertSql, connection))
            {
                insertCmd.Parameters.AddWithValue("@nome", dto.Nome.Trim());
                insertCmd.Parameters.AddWithValue("@sobrenome", dto.Sobrenome.Trim());
                insertCmd.Parameters.AddWithValue("@email", dto.Email.Trim().ToLower());
                insertCmd.Parameters.AddWithValue("@senhaHash", senhaHash);
                insertCmd.Parameters.AddWithValue("@cpf", dto.Cpf.Replace(".", "").Replace("-", "").Trim());
                insertCmd.Parameters.AddWithValue("@telefone", dto.Telefone.Replace("(", "").Replace(")", "").Replace("-", "").Replace(" ", "").Trim());

                await insertCmd.ExecuteNonQueryAsync();
            }

            return Ok(new { mensagem = "Cadastro realizado com sucesso!" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UsuarioLoginDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Senha))
            {
                return BadRequest(new { mensagem = "E-mail e senha são obrigatórios." });
            }

            using var connection = new MySqlConnection(_connectionString);
            await connection.OpenAsync();

            var sql = "SELECT id_usuario, nome, sobrenome, email, senha_hash FROM usuarios WHERE email = @email";

            using var cmd = new MySqlCommand(sql, connection);
            cmd.Parameters.AddWithValue("@email", dto.Email.Trim().ToLower());

            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                string senhaHashBanco = reader.GetString("senha_hash");

                // Valida a senha digitada com o hash salvo no MySQL
                if (BCrypt.Net.BCrypt.Verify(dto.Senha, senhaHashBanco))
                {
                    var usuario = new UsuarioRespostaDto
                    {
                        IdUsuario = reader.GetInt32("id_usuario"),
                        Nome = reader.GetString("nome"),
                        Sobrenome = reader.GetString("sobrenome"),
                        Email = reader.GetString("email")
                    };

                    return Ok(new { mensagem = "Login efetuado com sucesso!", usuario });
                }
            }

            return Unauthorized(new { mensagem = "E-mail ou senha incorretos. Tente novamente." });
        }
    }
}