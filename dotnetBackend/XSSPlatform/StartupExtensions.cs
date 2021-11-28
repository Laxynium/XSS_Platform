using System;
using System.IO;
using System.Threading.Tasks;
using LiteDB;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace XSSPlatform
{
    public static class StartupExtensions
    {
        public static void ConfigureCors(this IServiceCollection services, IConfiguration configuration)
        {
            var corsOptions = configuration.GetRequiredSection("Cors").Get<CorsOptions>();
            services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder =>
                {
                    builder.WithOrigins(corsOptions.Origins)
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials();
                });
            });
        }
        public static void ConfigureAuthorization(this IServiceCollection services)
        {
            services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                    options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                    options.DefaultSignOutScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                })
                .AddCookie(options =>
                {
                    options.Events.OnRedirectToLogin = (ctx) =>
                    {
                        ctx.Response.StatusCode = 404;
                        return Task.CompletedTask;
                    };
                    options.Cookie.SameSite = SameSiteMode.None;
                    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                });
            
            services.AddAuthorization(options =>
            {
                var policyBuilder = new AuthorizationPolicyBuilder(CookieAuthenticationDefaults.AuthenticationScheme)
                    .RequireAuthenticatedUser();
                options.DefaultPolicy = policyBuilder.Build();
            });
        }

        public static void ConfigureTokenGeneration(this IServiceCollection services)
        {
            services.AddSingleton<RandomStringGenerator>();
            services.AddSingleton<TokenGenerator>();
        }

        public static void ConfigureRepository(this IServiceCollection services, IHostEnvironment environment)
        {
            Console.WriteLine(environment.ContentRootPath);
            services.AddScoped(sp => new LiteDatabase(Path.Combine(environment.ContentRootPath,"App.db")));
            services.AddScoped<IUserRepository,UserRepository>();
        }

        public static void ConfigureOptions(this IServiceCollection services, IConfiguration configuration)
        {
            var levelsOptions = configuration.GetRequiredSection("LevelsOptions").Get<LevelsOptions>();
            services.AddSingleton(levelsOptions);
        }

        public static void ConfigureUserMapper(this IServiceCollection services)
        {
            services.AddSingleton<UserMapper>();
        }
        
    }
}