using LactafarmaAPI.Core;
using LactafarmaAPI.Data.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace LactafarmaAPI.Data
{
    public class LactafarmaContext : IdentityDbContext<User>
    {
        private readonly ILogger<LactafarmaContext> _logger;
        #region Public Properties

        public DbSet<Log> Logs { get; set; }
        public DbSet<Alert> Alerts { get; set; }
        public DbSet<Alias> Aliases { get; set; }
        public DbSet<AliasMultilingual> AliasMultilingual { get; set; }
        public DbSet<Brand> Brands { get; set; }
        public DbSet<BrandMultilingual> BrandsMultilingual { get; set; }
        public DbSet<ProductAlternative> ProductAlternatives { get; set; }
        public DbSet<ProductBrand> ProductBrands { get; set; }
        public DbSet<ProductGroup> ProductGroups { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductMultilingual> ProductsMultilingual { get; set; }
        public DbSet<Favorite> Favorites { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<GroupMultilingual> GroupsMultilingual { get; set; }
        public DbSet<Language> Languages { get; set; }

        #endregion

        #region Constructors

        public LactafarmaContext(DbContextOptions<LactafarmaContext> options, ILogger<LactafarmaContext> logger) : base(options)
        {
            _logger = logger;
        }

        #endregion

        #region Overridden Members

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            LactafarmaDbMapping.Configure(modelBuilder, _logger);
        }

        #endregion
    }
}