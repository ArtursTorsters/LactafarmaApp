using System;
using System.Collections.Generic;
using System.Linq;
using LactafarmaAPI.Controllers.Api.Base;
using LactafarmaAPI.Controllers.Api.Interfaces;
using LactafarmaAPI.Core;
using LactafarmaAPI.Data.Entities;
using LactafarmaAPI.Domain.Models;
using LactafarmaAPI.Domain.Models.Base;
using LactafarmaAPI.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace LactafarmaAPI.Controllers.Api
{
    /// <summary>
    /// Favorites handler class
    /// </summary>
    public class FavoritesController : BaseController, IFavoritesController
    {
        #region Private Properties

        private readonly ILogger<FavoritesController> _logger;

        #endregion

        #region Constructors

        /// <summary>
        /// Favorites handler constructor
        /// </summary>
        /// <param name="lactafarmaService"></param>
        /// <param name="mailService"></param>
        /// <param name="config"></param>
        /// <param name="logger"></param>
        /// <param name="cache"></param>
        /// <param name="userManager"></param>
        public FavoritesController(ILactafarmaService lactafarmaService, IMailService mailService,
            IConfigurationRoot config,
            ILogger<FavoritesController> logger, IMemoryCache cache, UserManager<Data.Entities.User> userManager) : base(
            lactafarmaService, mailService, config, cache, userManager)
        {
            _logger = logger;
        }

        #endregion

        #region Public Methods

        /// <summary>
        /// Get list of favorites by provided User
        /// </summary>
        /// <returns></returns>
        [HttpGet("byuser")]
        public IEnumerable<Domain.Models.Favorite> GetFavoritesByUser()
        {
            IEnumerable<Domain.Models.Favorite> result = null;
            var userId = _userManager.GetUserId(User);
            try
            {
                _logger.LogInformation("BEGIN GetFavoritesByUser");
                result = LactafarmaService.GetFavoritesByUser(Guid.Parse(userId));
                _logger.LogInformation("END GetFavoritesByUser");
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    $"Exception on JsonResult called GetFavoritesByUser(userId={userId}) with message {ex.Message}");
            }
            finally
            {
                if (result == null)
                    _logger.LogWarning("No results for current request!!!");
            }
            return result;
        }

        /// <summary>
        /// Get specific favorite by id
        /// </summary>
        /// <param name="favoriteId"></param>
        /// <returns></returns>
        [HttpGet("{favoriteId:int}")]        
        public Domain.Models.Favorite GetFavorite(int favoriteId)
        {
            Domain.Models.Favorite result = null;
            try
            {
                _logger.LogInformation("BEGIN GetFavorite");
                result = LactafarmaService.GetFavorite(favoriteId);
                _logger.LogInformation("END GetFavorite");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception on JsonResult called GetFavorite(favoriteId={favoriteId}) with message {ex.Message}");
            }
            finally
            {
                if (result == null)
                    _logger.LogWarning("No results for current request!!!");
            }
            return result;
        }

        #endregion
    }
}