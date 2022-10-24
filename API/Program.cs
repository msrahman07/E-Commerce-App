using API.Errors;
using API.Helpers;
using API.Middleware;
using Core.Interfaces;
using Infrastructure.Data;
using Infrastructure.Data.SeedData;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddAutoMapper(typeof(MappingProfiles));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<StoreContext>(options => options.UseSqlite(connectionString));
builder.Services.AddSingleton<IConnectionMultiplexer>(c => {
    var configuration = ConfigurationOptions.Parse(builder.Configuration.GetConnectionString("Redis"), true);
    return ConnectionMultiplexer.Connect(configuration);
});
builder.Services.AddScoped<IBasketRepository, BasketRepository>();

builder.Services.Configure<ApiBehaviorOptions>(options => 
{
    options.InvalidModelStateResponseFactory = actionContext =>
    {
        var errors = actionContext.ModelState
            .Where(e => e.Value!.Errors.Count > 0)
            .SelectMany(x => x.Value!.Errors)
            .Select(x => x.ErrorMessage).ToArray();
        var errorResponse = new ApiValidationErrorResponse 
        {
            Errors = errors
        };

        return new BadRequestObjectResult(errorResponse);
    };
});

builder.Services.AddCors(opt => 
{
    opt.AddPolicy("CorsPolicy", policy =>
    {
        policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:4200");
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseStatusCodePagesWithReExecute("/errors/{0}");

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseCors("CorsPolicy");
app.UseAuthorization();

app.MapControllers();

// Creating Scope for automated DB creation ======================
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
var logger = services.GetRequiredService<ILogger<Program>>();

try
{
    var context = services.GetRequiredService<StoreContext>();
    await context.Database.MigrateAsync();
    await StoreContextSeed.SeedAsync(context, logger);
}
catch (Exception ex)
{
    logger.LogError(ex, "An error occured during migration");
    // throw;
}
//================================================================
await app.RunAsync();