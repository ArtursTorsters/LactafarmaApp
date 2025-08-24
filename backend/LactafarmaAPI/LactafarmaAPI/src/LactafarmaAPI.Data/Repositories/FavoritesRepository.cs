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
    public class FavoritesRepository : DataRepositoryBase<Favorite, LactafarmaContext>, IFavoriteRepository
    {
        private readonly ILogger<FavoritesRepository> _logger;

        #region Constructors

        public FavoritesRepository(LactafarmaContext context, ILogger<FavoritesRepository> logger, IHttpContextAccessor httpContext) : base(context, httpContext)
        {
            _logger = logger;
        }

        #endregion

        #region Public Methods

        public IEnumerable<Favorite> GetFavoritesByUser(Guid userId)
        {
            try
            {
                return EntityContext.Favorites.Where(f => Guid.Parse(f.UserId) == userId)
                    .Include(a => a.Product)
                    .AsEnumerable();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception on GetFavoritesByUser with message: {ex.Message}");
                return null;
            }
        }

        public Favorite GetFavorite(int favoriteId)
        {
            try
            {
                return EntityContext.Favorites
                    .Include(a => a.Product)                    
                    .FirstOrDefault(f => f.Id == favoriteId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception on GetFavorite with message: {ex.Message}");
                return null;
            }
        }

        #endregion

        #region Overridden Members

        protected override Expression<Func<Favorite, bool>> IdentifierPredicate(int id)
        {
            return e => e.Id == id;
        }

        #endregion
    }
}