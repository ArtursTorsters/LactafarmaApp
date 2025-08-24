using System;
using LactafarmaAPI.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LactafarmaAPI.Data
{
    public class LactafarmaDbMapping
    {
        #region Public Methods

        public static void Configure(ModelBuilder modelBuilder, ILogger<LactafarmaContext> logger)
        {
            try
            {
                MapLog(modelBuilder, logger);
                MapLanguage(modelBuilder, logger);
                MapBrand(modelBuilder, logger);
                MapBrandMultilingual(modelBuilder, logger);
                MapRisk(modelBuilder, logger);
                MapRiskMultilingual(modelBuilder, logger);
                MapGroup(modelBuilder, logger);
                MapGroupMultilingual(modelBuilder, logger);

                //MapUser(modelBuilder, logger);
                MapFavorite(modelBuilder, logger);
                MapProduct(modelBuilder, logger);
                MapProductBrand(modelBuilder, logger);
                MapProductGroup(modelBuilder, logger);
                MapProductMultilingual(modelBuilder, logger);

                MapAlert(modelBuilder, logger);
                MapAlias(modelBuilder, logger);
                MapAliasMultilingual(modelBuilder, logger);

                MapProductAlternative(modelBuilder, logger);
            }
            catch (Exception ex)
            {
                logger.LogError($"LactafarmaDbMapping: Configure Method exception {ex.Message}");
            }
        }

        private static void MapLog(ModelBuilder modelBuilder, ILogger<LactafarmaContext> logger)
        {
            logger.LogInformation("BEGIN: Configuring entity Log");

            modelBuilder.Entity<Log>().ToTable("Logs");
            modelBuilder.Entity<Log>().Ignore(e => e.EntityId).HasKey(e => e.Id);
            modelBuilder.Entity<Log>(entity =>
            {
                entity.Property(e => e.Action).HasMaxLength(50);

                entity.Property(e => e.Application)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.Controller).HasMaxLength(50);

                entity.Property(e => e.Identity).HasMaxLength(50);

                entity.Property(e => e.Level)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.Logged).HasColumnType("datetime");

                entity.Property(e => e.Logger).HasMaxLength(250);

                entity.Property(e => e.Message).IsRequired();

                entity.Property(e => e.Referrer).HasMaxLength(250);

                entity.Property(e => e.Url).HasMaxLength(500);

                entity.Property(e => e.UserAgent).HasMaxLength(250);
            });
            logger.LogInformation("END: Configuring entity Log");

        }

        #endregion

        #region Private Methods

        private static void MapRisk(ModelBuilder modelBuilder, ILogger logger)
        {
            logger.LogInformation("BEGIN: Configuring entity Risk");
            modelBuilder.Entity<Risk>().ToTable("Risks");
            modelBuilder.Entity<Risk>().Ignore(e => e.EntityId).HasKey(e => e.Id);
            //modelBuilder.Entity<Brand>().HasMany(d => d.BrandsMultilingual);
            logger.LogInformation("END: Configuring entity Risk");
        }

        private static void MapRiskMultilingual(ModelBuilder modelBuilder, ILogger logger)
        {
            logger.LogInformation("BEGIN: Configuring entity RiskMultilingual");
            modelBuilder.Entity<RiskMultilingual>().ToTable("Risks_Multilingual");

            modelBuilder.Entity<RiskMultilingual>()
                .HasKey(bc => new { bc.RiskId, bc.LanguageId });

            //modelBuilder.Entity<BrandMultilingual>()
            //    .HasOne(bc => bc.Brand).WithMany(bc => bc.BrandsMultilingual).HasForeignKey(f => f.BrandId);                

            //modelBuilder.Entity<BrandMultilingual>()
            //    .HasOne(bc => bc.Language).WithMany(bc => bc.BrandsMultilingual).HasForeignKey(f => f.LanguageId);               
            logger.LogInformation("END: Configuring entity RiskMultilingual");
        }

        private static void MapBrand(ModelBuilder modelBuilder, ILogger logger)
        {
            logger.LogInformation("BEGIN: Configuring entity Brand");
            modelBuilder.Entity<Brand>().ToTable("Brands");
            modelBuilder.Entity<Brand>().Ignore(e => e.EntityId).HasKey(e => e.Id);
            //modelBuilder.Entity<Brand>().HasMany(d => d.BrandsMultilingual);
            logger.LogInformation("END: Configuring entity Brand");
        }

        private static void MapBrandMultilingual(ModelBuilder modelBuilder, ILogger logger)
        {
            logger.LogInformation("BEGIN: Configuring entity BrandMultilingual");
            modelBuilder.Entity<BrandMultilingual>().ToTable("Brands_Multilingual");

            modelBuilder.Entity<BrandMultilingual>()
                .HasKey(bc => new {bc.BrandId, bc.LanguageId});

            //modelBuilder.Entity<BrandMultilingual>()
            //    .HasOne(bc => bc.Brand).WithMany(bc => bc.BrandsMultilingual).HasForeignKey(f => f.BrandId);                

            //modelBuilder.Entity<BrandMultilingual>()
            //    .HasOne(bc => bc.Language).WithMany(bc => bc.BrandsMultilingual).HasForeignKey(f => f.LanguageId);               
            logger.LogInformation("END: Configuring entity BrandMultilingual");
        }

        private static void MapGroup(ModelBuilder modelBuilder, ILogger logger)
        {
            logger.LogInformation("BEGIN: Configuring entity Group");
            modelBuilder.Entity<Group>().ToTable("Groups");
            modelBuilder.Entity<Group>().Ignore(e => e.EntityId).HasKey(e => e.Id);
            //modelBuilder.Entity<Group>().HasMany(d => d.GroupsMultilingual);
            logger.LogInformation("END: Configuring entity Group");
        }

        private static void MapGroupMultilingual(ModelBuilder modelBuilder, ILogger logger)
        {
            logger.LogInformation("BEGIN: Configuring entity GroupMultilingual");
            modelBuilder.Entity<GroupMultilingual>().ToTable("Groups_Multilingual");

            modelBuilder.Entity<GroupMultilingual>()
                .HasKey(bc => new {bc.GroupId, bc.LanguageId});

            //modelBuilder.Entity<GroupMultilingual>()
            //    .HasOne(bc => bc.Group);                

            //modelBuilder.Entity<GroupMultilingual>()
            //    .HasOne(bc => bc.Language);                

            logger.LogInformation("END: Configuring entity GroupMultilingual");
        }

        private static void MapLanguage(ModelBuilder modelBuilder, ILogger logger)
        {
            logger.LogInformation("BEGIN: Configuring entity Language");
            modelBuilder.Entity<Language>().ToTable("Languages");
            modelBuilder.Entity<Language>().Ignore(e => e.EntityId).HasKey(e => e.Id);
            logger.LogInformation("END: Configuring entity Language");
        }    
        
        private static void MapFavorite(ModelBuilder modelBuilder, ILogger logger)
        {
            logger.LogInformation("BEGIN: Configuring entity Favorite");
            modelBuilder.Entity<Favorite>().ToTable("Favorites");
            modelBuilder.Entity<Favorite>().Ignore(e => e.EntityId).HasKey(e => e.Id);
            //modelBuilder.Entity<Favorite>().HasOne(d => d.Drug);
            //modelBuilder.Entity<Favorite>().HasOne(d => d.User);
            logger.LogInformation("END: Configuring entity Favorite");
        }

        private static void MapProduct(ModelBuilder modelBuilder, ILogger logger)
        {
            logger.LogInformation("BEGIN: Configuring entity Product");

            modelBuilder.Entity<Product>().ToTable("Products");
            modelBuilder.Entity<Product>().Ignore(e => e.EntityId).HasKey(e => e.Id);
            //modelBuilder.Entity<Drug>().HasOne(d => d.Group);
            //modelBuilder.Entity<Drug>().HasMany(d => d.DrugBrands);

            //modelBuilder.Entity<Drug>().HasMany(d => d.Alerts);
            //modelBuilder.Entity<Drug>().HasMany(d => d.Aliases);
            //modelBuilder.Entity<Drug>().HasMany(d => d.DrugAlternatives);

            logger.LogInformation("END: Configuring entity Product");
        }

        private static void MapProductBrand(ModelBuilder modelBuilder, ILogger logger)
        {
            logger.LogInformation("BEGIN: Configuring entity ProductBrand");

            modelBuilder.Entity<ProductBrand>().ToTable("ProductBrands");

            modelBuilder.Entity<ProductBrand>()
                .HasKey(bc => new {bc.BrandId, bc.ProductId});

            //modelBuilder.Entity<DrugBrand>()
            //    .HasOne(bc => bc.Drug)
            //    .WithMany(b => b.DrugBrands)
            //    .HasForeignKey(bc => bc.DrugId);

            //modelBuilder.Entity<DrugBrand>()
            //    .HasOne(bc => bc.Brand)
            //    .WithMany(c => c.DrugBrands)
            //    .HasForeignKey(bc => bc.BrandId);

            logger.LogInformation("END: Configuring entity ProductBrand");
        }

        private static void MapProductGroup(ModelBuilder modelBuilder, ILogger logger)
        {
            logger.LogInformation("BEGIN: Configuring entity ProductGroup");

            modelBuilder.Entity<ProductGroup>().ToTable("ProductGroups");

            modelBuilder.Entity<ProductGroup>()
                .HasKey(bc => new { bc.GroupId, bc.ProductId });

            //modelBuilder.Entity<DrugBrand>()
            //    .HasOne(bc => bc.Drug)
            //    .WithMany(b => b.DrugBrands)
            //    .HasForeignKey(bc => bc.DrugId);

            //modelBuilder.Entity<DrugBrand>()
            //    .HasOne(bc => bc.Brand)
            //    .WithMany(c => c.DrugBrands)
            //    .HasForeignKey(bc => bc.BrandId);

            logger.LogInformation("END: Configuring entity ProductGroup");
        }

        private static void MapProductMultilingual(ModelBuilder modelBuilder, ILogger logger)
        {
            logger.LogInformation("BEGIN: Configuring entity ProductMultilingual");

            modelBuilder.Entity<ProductMultilingual>().ToTable("Products_Multilingual");

            modelBuilder.Entity<ProductMultilingual>()
                .HasKey(bc => new {bc.ProductId, bc.LanguageId});

            //modelBuilder.Entity<DrugMultilingual>()
            //    .HasOne(bc => bc.Drug)
            //    .WithMany(b => b.DrugsMultilingual)
            //    .HasForeignKey(bc => bc.DrugId);

            //modelBuilder.Entity<DrugMultilingual>()
            //    .HasOne(bc => bc.Language);                

            logger.LogInformation("END: Configuring entity ProductMultilingual");
        }

        private static void MapAlert(ModelBuilder modelBuilder, ILogger logger)
        {
            logger.LogInformation("BEGIN: Configuring entity Alert");

            modelBuilder.Entity<Alert>().ToTable("Alerts");
            modelBuilder.Entity<Alert>().Ignore(e => e.EntityId).HasKey(e => e.Id);
            //modelBuilder.Entity<Alert>().HasOne(d => d.Drug).WithMany(d => d.Alerts);

            logger.LogInformation("END: Configuring entity Alert");
        }        

        private static void MapAlias(ModelBuilder modelBuilder, ILogger logger)
        {
            logger.LogInformation("BEGIN: Configuring entity Alias");

            modelBuilder.Entity<Alias>().ToTable("Aliases");
            modelBuilder.Entity<Alias>().Ignore(e => e.EntityId).HasKey(e => e.Id);
            modelBuilder.Entity<Alias>().HasOne(d => d.Product);
            modelBuilder.Entity<Alias>().HasMany(d => d.AliasMultilingual);

            logger.LogInformation("END: Configuring entity Alias");
        }

        private static void MapAliasMultilingual(ModelBuilder modelBuilder, ILogger logger)
        {
            logger.LogInformation("BEGIN: Configuring entity AliasMultilingual");

            modelBuilder.Entity<AliasMultilingual>().ToTable("Aliases_Multilingual");

            modelBuilder.Entity<AliasMultilingual>()
                .HasKey(bc => new {bc.AliasId, bc.LanguageId});
            //modelBuilder.Entity<AliasMultilingual>()
            //    .HasOne(bc => bc.Language);

            //modelBuilder.Entity<AliasMultilingual>()
            //    .HasOne(bc => bc.Alias)
            //    .WithMany(b => b.AliasMultilingual)
            //    .HasForeignKey(bc => bc.AliasId);                   

            logger.LogInformation("END: Configuring entity AliasMultilingual");
        }

        private static void MapProductAlternative(ModelBuilder modelBuilder, ILogger logger)
        {
            logger.LogInformation("BEGIN: Configuring entity ProductAlternative");

            modelBuilder.Entity<ProductAlternative>().ToTable("ProductAlternatives");

            modelBuilder.Entity<ProductAlternative>()
                .HasKey(bc => new {bc.ProductId, bc.ProductAlternativeId});

            modelBuilder.Entity<ProductAlternative>().HasOne(t => t.ProductAlt).WithOne().HasForeignKey<ProductAlternative>("ProductAlternativeId");

            //modelBuilder.Entity<DrugAlternative>()
            //    .HasOne(bc => bc.Drug)
            //    .WithMany(b => b.DrugAlternatives)
            //    .HasForeignKey(bc => bc.DrugId);

            //modelBuilder.Entity<DrugAlternative>()
            //    .HasOne(bc => bc.DrugOption)
            //    .WithMany(c => c.DrugAlternatives)
            //    .HasForeignKey(bc => bc.DrugAlternativeId);

            logger.LogInformation("END: Configuring entity ProductAlternative");
        }

        #endregion
    }
}