using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using LactafarmaAPI.Core;
using LactafarmaAPI.Data.Entities;
using LactafarmaAPI.Data.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace LactafarmaAPI.Data.Repositories
{
    public class BrandsRepository : DataRepositoryBase<Brand, LactafarmaContext>, IBrandRepository
    {
        private readonly ILogger<BrandsRepository> _logger;

        #region Constructors

        public BrandsRepository(LactafarmaContext context, ILogger<BrandsRepository> logger, IHttpContextAccessor httpContext) : base(context, httpContext)
        {
            _logger = logger;
        }

        #endregion

        #region Public Methods

        public IEnumerable<BrandMultilingual> GetAllBrands()
        {
            try
            {
                return EntityContext.BrandsMultilingual.Where(l => l.LanguageId == LanguageId)
                    .Include(b => b.Brand)
                    .AsEnumerable();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception on GetAllBrands with message: {ex.Message}");
                return null;
            }
        }

        public IEnumerable<BrandMultilingual> GetBrandsByProduct(int productId)
        {
            try
            {
                return EntityContext.BrandsMultilingual.Where(l => l.LanguageId == LanguageId).Include(a => a.Brand)
                    .ThenInclude(d => d.ProductBrands)
                    .Where(a => a.Brand.ProductBrands.FirstOrDefault().ProductId == productId).AsEnumerable();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception on GetBrandsByProduct with message: {ex.Message}");
                return null;
            }
        }

        public BrandMultilingual GetBrand(int brandId)
        {
            try
            {
                return EntityContext.BrandsMultilingual.Where(l => l.LanguageId == LanguageId && l.BrandId == brandId)
                    .Include(a => a.Brand).FirstOrDefault();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception on GetBrand with message: {ex.Message}");
                return null;
            }
        }

        #endregion

        #region Overridden Members

        protected override Expression<Func<Brand, bool>> IdentifierPredicate(int id)
        {
            return e => e.Id == id;
        }

        #endregion
    }
}