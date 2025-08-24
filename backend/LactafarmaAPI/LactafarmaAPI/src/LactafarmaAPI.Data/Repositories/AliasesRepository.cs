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
    public class AliasesRepository : DataRepositoryBase<Alias, LactafarmaContext>, IAliasRepository
    {
        private readonly ILogger<AliasesRepository> _logger;

        #region Constructors

        public AliasesRepository(LactafarmaContext context, ILogger<AliasesRepository> logger, IHttpContextAccessor httpContext) : base(context, httpContext)
        {
            _logger = logger;
        }

        #endregion

        #region Public Methods

        public IEnumerable<AliasMultilingual> GetAllAliases()
        {
            try
            {
                return EntityContext.AliasMultilingual.Where(e => e.LanguageId == LanguageId).Include(a => a.Alias)
                    .AsEnumerable();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception on GetAllAliases with message: {ex.Message}");
                return null;
            }
        }

        public IEnumerable<AliasMultilingual> GetAliasesByProduct(int productId)
        {
            try
            {
                return EntityContext.AliasMultilingual.Where(e => e.LanguageId == LanguageId).Include(a => a.Alias)
                    .ThenInclude(d => d.Product)
                    .Where(a => a.Alias.ProductId == productId).AsEnumerable();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception on GetAliasesByProduct with message: {ex.Message}");
                return null;
            }
        }        

        public AliasMultilingual GetAlias(int aliasId)
        {
            try
            {
                return EntityContext.AliasMultilingual.Where(am => am.LanguageId == LanguageId).Include(a => a.Alias)
                    .FirstOrDefault();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception on GetAlias with message: {ex.Message}");
                return null;
            }
        }

        #endregion

        #region Overridden Members

        protected override Expression<Func<Alias, bool>> IdentifierPredicate(int id)
        {
            return e => e.Id == id;
        }

        #endregion
    }
}