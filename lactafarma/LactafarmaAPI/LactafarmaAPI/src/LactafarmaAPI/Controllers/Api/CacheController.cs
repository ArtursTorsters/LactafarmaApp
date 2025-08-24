using System;
using System.Threading.Tasks;
using LactafarmaAPI.Controllers.Api.Base;
using LactafarmaAPI.Data.Entities;
using LactafarmaAPI.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace LactafarmaAPI.Controllers.Api
{
    /// <summary>
    /// Cache handler class
    /// </summary>
    public class CacheController : BaseController
    {
        #region Private Properties

        private readonly ILogger<CacheController> _logger;

        #endregion

        #region Constructors

        /// <summary>
        /// Cache handler constructor
        /// </summary>
        /// <param name="lactafarmaService"></param>
        /// <param name="mailService"></param>
        /// <param name="config"></param>
        /// <param name="logger"></param>
        /// <param name="cache"></param>
        /// <param name="userManager"></param>
        public CacheController(ILactafarmaService lactafarmaService, IMailService mailService,
            IConfigurationRoot config, ILogger<CacheController> logger, IMemoryCache cache, UserManager<User> userManager) : base(lactafarmaService, mailService, config, cache, userManager)
        {
            _logger = logger;
        }

        #endregion

        #region Public Methods
        
        /// <summary>
        /// Load all objects for caching just on Id/Name fields
        /// </summary>
        /// <returns></returns>
        [HttpGet("load")]
        public async Task<IActionResult> LoadCaches()
        {
            JsonResult result = null;
            try
            {
                _logger.LogInformation("BEGIN LoadCaches");
                await LoadCachesAsync();
                result = new JsonResult(true);
                _logger.LogInformation("END LoadCaches");
            }
            catch (Exception ex)
            {
                result = new JsonResult(false);
                _logger.LogError(
                    $"Exception on JsonResult called LoadCaches with message {ex.Message}");
            }
            finally
            {
                if (result == Json(false))
                    _logger.LogWarning("No results for current request!!!");
            }

            return result;
        }

        /// <summary>
        /// Clear all objects from Memory
        /// </summary>
        /// <returns></returns>
        [HttpGet("clear")]
        public async Task<IActionResult> ClearCaches()
        {
            var result = new JsonResult(false);
            try
            {
                _logger.LogInformation("BEGIN ClearCaches");
                await ClearCachesAsync();
                result = new JsonResult(true);
                _logger.LogInformation("END ClearCaches");
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    $"Exception on JsonResult called ClearCaches with message {ex.Message}");
            }

            return result;
        }



        #endregion

        #region Private Methods

        /// <summary>
        /// Clear set of objects stored on IMemoryCache
        /// </summary>
        private async Task ClearCachesAsync()
        {
            await Task.Run(() => Cache.Remove(EntityType.Alias));
            await Task.Run(() => Cache.Remove(EntityType.Product));
            await Task.Run(() => Cache.Remove(EntityType.Group));
            await Task.Run(() => Cache.Remove(EntityType.Brand));
        }

        private async Task LoadCachesAsync()
        {
            try
            {
                _logger.LogInformation("BEGIN LoadCachesAsync");
                await Task.Run(() => CacheInitialize(LactafarmaService.GetAllProducts(), EntityType.Product));
                await Task.Run(() => CacheInitialize(LactafarmaService.GetAllAliases(), EntityType.Alias));
                await Task.Run(() => CacheInitialize(LactafarmaService.GetAllBrands(), EntityType.Brand));
                await Task.Run(() => CacheInitialize(LactafarmaService.GetAllGroups(), EntityType.Group));
                _logger.LogInformation("END LoadCachesAsync");
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    $"Exception on JsonResult called LoadCachesAsync with message {ex.Message}");
            }
        }

        #endregion
    }
}