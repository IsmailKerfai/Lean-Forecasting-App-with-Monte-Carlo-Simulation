using backend.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers(); // Falls erforderlich für weitere Endpoints.
builder.Services.AddScoped<MonteCarloStoriesService>();
builder.Services.AddScoped<MonteCarloFeaturesService>();
builder.Services.AddScoped<Filter>();


builder.Services.AddControllers();  
builder.Services.AddLogging();      

builder.Services.AddEndpointsApiExplorer();  // For Swagger
builder.Services.AddSwaggerGen();   

var app = builder.Build();

app.UseCors(policy =>
    policy.AllowAnyOrigin()
          .AllowAnyHeader()
          .AllowAnyMethod());


if (app.Environment.IsDevelopment())
{
    app.UseSwagger(); // Enable Swagger UI 
    app.UseSwaggerUI();
}

app.UseRouting();

app.MapControllers();  
app.Run();


