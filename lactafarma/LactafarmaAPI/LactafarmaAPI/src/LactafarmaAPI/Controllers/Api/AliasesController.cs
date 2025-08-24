using System;
using System.Collections.Generic;
using System.Linq;
using LactafarmaAPI.Controllers.Api.Base;
using LactafarmaAPI.Controllers.Api.Interfaces;
using LactafarmaAPI.Core;
using LactafarmaAPI.Data.Entities;
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
    /// Alerts handler class
    /// </summary>
    public class AliasesController : BaseController, IAliasesController
    {
        #region Private Properties

        private readonly ILogger<AliasesController> _logger;

        #endregion

        #region Constructors

        /// <summary>
        /// Aliases handler constructor
        /// </summary>
        /// <param name="lactafarmaService"></param>
        /// <param name="mailService"></param>
        /// <param name="config"></param>
        /// <param name="logger"></param>
        /// <param name="cache"></param>
        /// <param name="userManager"></param>
        public AliasesController(ILactafarmaService lactafarmaService, IMailService mailService,
            IConfigurationRoot config,
            ILogger<AliasesController> logger, IMemoryCache cache, UserManager<User> userManager) : base(lactafarmaService, mailService, config, cache, userManager)
        {
            _logger = logger;

            CacheInitialize(lactafarmaService.GetAllAliases(), EntityType.Alias);
        }

        #endregion

        #region Public Methods

        /// <summary>
        /// Get first 3 coincidences on aliases collection
        /// </summary>
        /// <param name="startsWith"></param>
        /// <returns></returns>
        [HttpGet("byname/{startsWith}")]
        public IEnumerable<Domain.Models.Alias> GetAliasesByName(string startsWith)
        {
            IEnumerable<Domain.Models.Alias> result = null;
            try
            {
                _logger.LogInformation("BEGIN GetAliasesByName");

                if (startsWith.Length < 1)
                {
                    _logger.LogWarning("Call to the API without any letter!!");
                    return null;
                }

                Cache.TryGetValue(EntityType.Alias, out IEnumerable<Domain.Models.Alias> aliases);

                result = aliases
                    .Where(a => a.VirtualName.IndexOf(startsWith.RemoveDiacritics(), StringComparison.CurrentCultureIgnoreCase) !=
                                -1).Take(3);

                _logger.LogInformation("END GetAliasesByName");
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    $"Exception on JsonResult called GetAliasesByName(name={startsWith}) with message {ex.Message}");
            }
            finally
            {
                if (result == null)
                    _logger.LogWarning("No results for current request!!!");
            }
            return result;
        }

        /// <summary>
        /// Get aliases by specified Product in User context
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        [HttpGet("byproduct/{productId:int}")]
        public IEnumerable<Domain.Models.Alias> GetAliasesByProduct(int productId)
        {
            IEnumerable<Domain.Models.Alias> result = null;
            try
            {
                _logger.LogInformation("BEGIN GetAliasesByProduct");
                result = LactafarmaService.GetAliasesByProduct(productId);
                _logger.LogInformation("END GetAliasesByProduct");
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    $"Exception on JsonResult called GetAliasesByProduct(productId={productId}) with message {ex.Message}");
            }
            finally
            {
                if (result == null)
                    _logger.LogWarning("No results for current request!!!");
            }

            return result;
        }

        /// <summary>
        /// Get detailed information about alias requested
        /// </summary>
        /// <param name="aliasId"></param>
        /// <returns></returns>
        [HttpGet("{aliasId:int}")]
        public Domain.Models.Alias GetAlias(int aliasId)
        {
            Domain.Models.Alias result = null;
            try
            {
                _logger.LogInformation("BEGIN GetAlias");
                result = LactafarmaService.GetAlias(aliasId);
                _logger.LogInformation("END GetAlias");
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    $"Exception on JsonResult called GetAlias(aliasId={aliasId}) with message {ex.Message}");
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