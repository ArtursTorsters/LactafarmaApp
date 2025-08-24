using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Claims;
using LactafarmaAPI.Core;
using LactafarmaAPI.Data.Entities;
using LactafarmaAPI.Data.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace LactafarmaAPI.Data.Repositories
{
    public class ProductsRepository : DataRepositoryBase<Product, LactafarmaContext>, IProductRepository
    {
        private readonly ILogger<ProductsRepository> _logger;

        #region Constructors

        public ProductsRepository(LactafarmaContext context, ILogger<ProductsRepository> logger, IHttpContextAccessor httpContext) : base(context, httpContext)
        {
            _logger = logger;
        }

        #endregion

        #region Public Methods

        public IEnumerable<ProductMultilingual> GetAllProducts()
        {
            try
            {
                return EntityContext.ProductsMultilingual.Where(l => l.LanguageId == LanguageId).Include(d => d.Product)
                    .ThenInclude(e => e.Risk)
                    .ThenInclude(e => e.RisksMultilingual)
                    .AsEnumerable();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception on GetAllProducts with message: {ex.Message}");
                return null;
            }
        }

        public IEnumerable<ProductAlternative> GetAlternativesByProduct(int productId)
        {
            try
            {
                return EntityContext.ProductAlternatives.Where(db => db.ProductId == productId).Include(d => d.ProductAlt)                    
                    .ThenInclude(e => e.Risk)
                    .ThenInclude(e => e.RisksMultilingual)
                    .Include(dm => dm.ProductAlt.ProductsMultilingual)
                    .Where(dm => dm.ProductAlt.ProductsMultilingual.FirstOrDefault().LanguageId == LanguageId).AsEnumerable();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception on GetAlternativesByProduct with message: {ex.Message}");
                return null;
            }
        }

        public IEnumerable<ProductGroup> GetProductsByGroup(int groupId)
        {
            try
            {
                return EntityContext.ProductGroups.Where(db => db.GroupId == groupId).Include(d => d.Product)
                    .ThenInclude(e => e.Risk)
                    .ThenInclude(e => e.RisksMultilingual)
                    .Include(dm => dm.Product.ProductsMultilingual)
                    .Where(dm => dm.Product.ProductsMultilingual.FirstOrDefault().LanguageId == LanguageId).AsEnumerable();                
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception on GetProductsByGroup with message: {ex.Message}");
                return null;
            }
        }

        public IEnumerable<ProductBrand> GetProductsByBrand(int brandId)
        {
            try
            {
                return EntityContext.ProductBrands.Where(db => db.BrandId == brandId).Include(d => d.Product).ThenInclude(e => e.Risk)
                    .ThenInclude(e => e.RisksMultilingual)
                    .Include(dm => dm.Product.ProductsMultilingual)
                    .Where(dm => dm.Product.ProductsMultilingual.FirstOrDefault().LanguageId == LanguageId).AsEnumerable();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception on GetProductsByBrand with message: {ex.Message}");
                return null;
            }
        }

        public ProductMultilingual GetProductByAlias(int aliasId)
        {
            try
            {
                var alias = EntityContext.Aliases.Where(d => d.Id == aliasId).Include(d => d.Product).ThenInclude(e => e.Risk)
                    .ThenInclude(e => e.RisksMultilingual)
                    .Include(dm => dm.Product.ProductsMultilingual).FirstOrDefault();

                return alias.Product.ProductsMultilingual.Single(d => d.LanguageId == LanguageId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception on GetProductByAlias with message: {ex.Message}");
                return null;
            }
        }

        public ProductMultilingual GetProduct(int productId)
        {
            try
            {
                return EntityContext.ProductsMultilingual.Where(e => e.ProductId == productId && e.LanguageId == LanguageId)
                    .Include(e => e.Product).ThenInclude(e => e.Risk)
                    .ThenInclude(e => e.RisksMultilingual).FirstOrDefault();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception on GetProduct with message: {ex.Message}");
                return null;
            }
        }

        #endregion

        #region Overridden Members

        protected override Expression<Func<Product, bool>> IdentifierPredicate(int id)
        {
            return e => e.Id == id;
        }

        #endregion
    }
}