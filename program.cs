using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace models
{
    // criar a classe publica
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // adicionar a API 
            builder.Services.AddControllers();

            // configurar o cors
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("PermitirTudo", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });

            var app = builder.Build();

            // habilitar o cors
            app.UseCors("PermitirTudo");

            // permitir o envio de arquivos a pasta wwwroot
            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.UseRouting();
            app.UseAuthorization();

            // mapear os controles
            app.MapControllers();

            app.Run();
        }
    }
}