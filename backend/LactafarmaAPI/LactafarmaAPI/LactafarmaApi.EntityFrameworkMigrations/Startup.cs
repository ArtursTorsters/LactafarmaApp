using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Serialization;

namespace LactafarmaApi.EntityFrameworkMigrations
{
    public class Startup
    {
        #region Private Properties

        private readonly IConfigurationRoot _config;
        private readonly IHostingEnvironment _env;

        #endregion

        #region Constructors

        public Startup(IHostingEnvironment env)
        {
            _env = env;

            var builder = new ConfigurationBuilder()
                .SetBasePath(_env.ContentRootPath)
                .AddJsonFile("config.json")
                .AddEnvironmentVariables();

            _config = builder.Build();
        }

        #endregion

        #region Public Methods

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit http://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton(_config);

            services.AddDbContext<MigrationContext>();

            services.AddIdentity<MigrationUser, IdentityRole>(config => { config.User.RequireUniqueEmail = true; })
                .AddEntityFrameworkStores<MigrationContext>();

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
                            ctx.Response.StatusCode = 401;
                        else
                            ctx.Response.Redirect(ctx.RedirectUri);
                        await Task.Yield();
                    }
                };
            });

            services.AddLogging();

            services.AddMvc(config =>
                {
                    if (_env.IsProduction())
                        config.Filters.Add(new RequireHttpsAttribute());
                })
                .AddJsonOptions(config =>
                {
                    config.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app,
            IHostingEnvironment env,
            ILoggerFactory factory)
        {
            if (env.IsEnvironment("Development"))
            {
                app.UseDeveloperExceptionPage();
                factory.AddDebug(LogLevel.Information);
            }
            else
            {
                factory.AddDebug(LogLevel.Error);
            }

            app.UseStaticFiles();

            app.UseAuthentication();

            app.UseMvc(config =>
            {
                config.MapRoute(
                    "Default",
                    "{controller}/{action}/{id?}",
                    new {controller = "App", action = "Index"}
                );
            });
        }

        #endregion
    }
}
