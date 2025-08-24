using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace LactafarmaApi.EntityFrameworkMigrations
{
    public class MigrationContext : IdentityDbContext<MigrationUser>
    {
        #region Private Properties

        private readonly IConfigurationRoot _config;

        #endregion

        #region Constructors

        public MigrationContext(IConfigurationRoot config, DbContextOptions options)
            : base(options)
        {
            _config = config;
        }

        #endregion

        #region Overridden Members

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);

            optionsBuilder.UseSqlServer(_config["ConnectionStrings:MigrationContextConnection"]);
        }

        #endregion
    }
}