using System;
using System.IO;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Collections.Generic;
using LactafarmaAPI.Data;
using LactafarmaAPI.Data.Entities;
using LactafarmaAPI.Data.Interfaces;
using LactafarmaAPI.Data.Repositories;
using LactafarmaAPI.Services;
using LactafarmaAPI.Services.Interfaces;
using LactafarmaAPI.Services.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.VisualBasic;
// UPDATED: Changed to IWebHostEnvironment
using Microsoft.Extensions.Hosting;

using Newtonsoft.Json.Serialization;
using NLog;
using NLog.Extensions.Logging;
using NLog.Web;
using LogLevel = Microsoft.Extensions.Logging.LogLevel;
// UPDATED: Changed Swagger imports for newer versions
using Microsoft.OpenApi.Models;
// REMOVED: Microsoft.Extensions.PlatformAbstractions - use alternative approach

namespace LactafarmaAPI
{
    /// <summary>
    /// Startup class
    /// </summary>
    public class Startup
    {
        #region Private Properties

        // UPDATED: Changed to IWebHostEnvironment
        private readonly IWebHostEnvironment _env;

        #endregion

        #region Public Properties

        /// <summary>
        /// IConfiguration (updated from IConfigurationRoot)
        /// </summary>
        public IConfiguration Configuration { get; }

        #endregion

        #region Constructors

        /// <summary>
        /// Startup constructor
        /// </summary>
        /// <param name="env"></param>
        // UPDATED: Changed parameter type to IWebHostEnvironment
        public Startup(IWebHostEnvironment env)
        {
            _env = env;

            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", true, true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", true)
                .AddEnvironmentVariables();

            Configuration = builder.Build();

            // UPDATED: ConfigureNLog is handled in Configure method now
        }

        #endregion

        #region Public Methods


        /// <summary>
        /// This method gets called by the runtime. Use this method to add services to the container
        /// </summary>
        /// <param name="services"></param>
        public void ConfigureServices(IServiceCollection services)
        {
            // Add framework services.
            services.AddSingleton(Configuration);

            //TODO: Create Real Mail Service for sending to emails for administrator role
            //if (_env.IsEnvironment("Development") || _env.IsEnvironment("Testing"))
            services.AddSingleton<IMailService, MailSenderService>();

            // EF Core Identity
            services.AddIdentity<User, IdentityRole>(config =>
            {
                // Password settings
                config.Password.RequireDigit = true;
                config.Password.RequiredLength = 8;
                config.Password.RequireNonAlphanumeric = false;
                config.Password.RequireUppercase = true;
                config.Password.RequireLowercase = false;

                // Lockout settings
                config.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(30);
                config.Lockout.MaxFailedAccessAttempts = 10;

                // User settings
                config.User.RequireUniqueEmail = true;
            }).AddEntityFrameworkStores<LactafarmaContext>().AddDefaultTokenProviders();

            // Cookie settings
            services.ConfigureApplicationCookie(config =>
            {
                config.LoginPath = "/auth/login";
                config.LogoutPath = "/auth/logout";
                config.ExpireTimeSpan = TimeSpan.FromDays(150);
            });

            //Handle AuthenticationEvents on API calls (401 message)
            services.ConfigureApplicationCookie(config =>
            {
                config.Events = new CookieAuthenticationEvents
                {
                    OnRedirectToLogin = async ctx =>
                    {
                        if (ctx.Request.Path.StartsWithSegments("/api") && ctx.Response.StatusCode == 200)
                        {
                            ctx.Response.StatusCode = 401;
                        }
                        else
                        {
                            ctx.Response.Redirect(ctx.RedirectUri);
                        }
                        await Task.Yield();
                    }
                };
            });

            // Adding custom properties to ClaimPrincipal (LanguageId) - Extend the default one: HttpContext.User
            services.AddScoped<IUserClaimsPrincipalFactory<User>, AppClaimsPrincipalFactory>();

            //Entity Framework Core configuration
            services.AddEntityFrameworkSqlServer().AddDbContext<LactafarmaContext>(config =>
            {
                config.UseSqlServer(Configuration["ConnectionStrings:LactafarmaContextConnection"]);
            });

            //Configuration variables for NLog
            LogManager.Configuration.Variables["connectionString"] =
                Configuration["ConnectionStrings:LactafarmaContextConnection"];
            LogManager.Configuration.Variables["configDir"] = Directory.GetCurrentDirectory();

            //This interface is required for getting info from HttpContext (like Controller, Action, Url, UserAgent...)
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            //Repository collection used on LactafarmaApi
            services.AddScoped<IAliasRepository, AliasesRepository>();
            services.AddScoped<IAlertRepository, AlertsRepository>();
            services.AddScoped<IBrandRepository, BrandsRepository>();
            services.AddScoped<IProductRepository, ProductsRepository>();
            services.AddScoped<IGroupRepository, GroupsRepository>();
            services.AddScoped<IFavoriteRepository, FavoritesRepository>();
            //services.AddScoped<IUserRepository, UsersRepository>();
            services.AddScoped<ILogRepository, LogRepository>();

            //General service for retrieving items from EF Core
            services.AddScoped<ILactafarmaService, LactafarmaService>();

            //Allow logging system (ILogger)
            services.AddLogging();

            // UPDATED: Modern Swagger configuration
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "LactafarmaApi",
                    Description = "API for getting interesting information about products for breastfeeding, also it will be used as template for ASP.NET Core projects with Entity Framework Core (2.0)",
                    Version = "v1",
                    Contact = new OpenApiContact { Email = "xpertpoint.solutions@gmail.com", Url = new Uri("https://github.com/gomnet/lactafarma/issues") }
                });

                // UPDATED: Alternative approach without PlatformAbstractions
                var xmlFile = "LactafarmaAPI.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                if (File.Exists(xmlPath))
                {
                    c.IncludeXmlComments(xmlPath);
                }

                // UseFullTypeNameInSchemaIds replacement for .NET Core
                c.CustomSchemaIds(x => x.FullName);
            });

            //Allow Controllers services to be specified
            //Add AuthorizeFilter to demand the user to be authenticated in order to access resources.
            // UPDATED: Add Controllers instead of MVC
            services.AddControllers(options =>
            {
                //TODO: SSL requirement on Hosting
                //if (_env.IsProduction())
                //{
                //    options.Filters.Add(new RequireHttpsAttribute());
                //}
                //options.Filters
                //    .Add(new AuthorizeFilter(new AuthorizationPolicyBuilder().RequireAuthenticatedUser()
                //        .Build()));
            })
            // UPDATED: Modern JSON configuration
            .AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.ContractResolver = new DefaultContractResolver();
            });

            // Set up policies from claims
            services.AddAuthorization(options =>
            {
                options.AddPolicy("Administrator", policyBuilder =>
                {
                    policyBuilder.RequireAuthenticatedUser()
                        .RequireAssertion(context => context.User.HasClaim(ClaimTypes.Role, "Administrator"))
                        .Build();
                });
            });

            // Adds a default in-memory implementation of IDistributedCache.
            services.AddDistributedMemoryCache();

            services.AddSession();
        }

        /// <summary>
        /// This method gets called by the runtime. Use this method to configure the HTTP request pipeline
        /// </summary>
        /// <param name="app"></param>
        /// <param name="env"></param>
        // UPDATED: Removed ILoggerFactory parameter - NLog is configured differently in .NET 8
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            // Modern environment checking
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            //app.UseDefaultFiles();
            app.UseStaticFiles();

            // UPDATED: Add routing before authentication
            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseSession();

            app.UseSwagger(c =>
            {
                c.RouteTemplate = "help/{documentName}/lactafarma.json";
                c.PreSerializeFilters.Add((swagger, httpReq) => swagger.Servers = new List<OpenApiServer> { new OpenApiServer { Url = $"{httpReq.Scheme}://{httpReq.Host.Value}" } });
            });

            //Indicate endpoints/documents for Swagger UI generator
            app.UseSwaggerUI(c =>
            {
                c.RoutePrefix = "help";
                c.SwaggerEndpoint("/help/v1/lactafarma.json", "LactafarmaApi V1");
                c.InjectStylesheet("/css/themes/theme-monokai.css");
                // UPDATED: Removed obsolete InjectOnCompleteJavaScript
            });

            // UPDATED: Modern endpoint mapping instead of UseMvc
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }

        #endregion
    }
}
