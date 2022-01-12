using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using XSSPlatform;

var builder = WebApplication
    .CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.ConfigureCors(builder.Configuration);
builder.Services.ConfigureAuthorization();
builder.Services.ConfigureTokenGeneration();
builder.Services.ConfigureRepository(builder.Environment);
builder.Services.ConfigureOptions(builder.Configuration);
builder.Services.ConfigureUserMapper();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
public partial class Program {}