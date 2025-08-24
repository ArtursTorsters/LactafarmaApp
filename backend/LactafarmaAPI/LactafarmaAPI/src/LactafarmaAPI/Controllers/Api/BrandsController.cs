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
    /// Brands handler class
    /// </summary>
    public class BrandsController : BaseController, IBrandsController
    {
        #region Private Properties

        private readonly ILogger<BrandsController> _logger;

        #endregion

        #region Constructors

        /// <summary>
        /// Brands handler constructor
        /// </summary>
        /// <param name="lactafarmaService"></param>
        /// <param name="mailService"></param>
        /// <param name="config"></param>
        /// <param name="logger"></param>
        /// <param name="cache"></param>
        /// <param name="userManager"></param>
        public BrandsController(ILactafarmaService lactafarmaService, IMailService mailService,
            IConfigurationRoot config,
            ILogger<BrandsController> logger, IMemoryCache cache, UserManager<User> userManager) : base(lactafarmaService, mailService, config, cache, userManager)
        {
            _logger = logger;

            CacheInitialize(lactafarmaService.GetAllBrands(), EntityType.Brand);
        }

        #endregion

        #region Public Methods

        /// <summary>
        /// Get first 3 coincidences on brands collection
        /// </summary>
        /// <param name="startsWith"></param>
        /// <returns></returns>
        [HttpGet("byname/{startsWith}")]
        public IEnumerable<Domain.Models.Brand> GetBrandsByName(string startsWith)
        {
            IEnumerable<Domain.Models.Brand> result = null;
            try
            {
                _logger.LogInformation("BEGIN GetBrandsByName");

                if (startsWith.Length < 1)
                {
                    _logger.LogWarning("Call to the API without any letter!!");
                    return null;
                }

                Cache.TryGetValue(EntityType.Brand, out IEnumerable<Domain.Models.Brand> brands);

                result = brands
                    .Where(a => a.VirtualName.IndexOf(startsWith.RemoveDiacritics(), StringComparison.CurrentCultureIgnoreCase) !=
                                -1).Take(3);

                _logger.LogInformation("END GetBrandsByName");
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    $"Exception on JsonResult called GetBrandsByName(name={startsWith}) with message {ex.Message}");
            }
            finally
            {
                if (result == null)
                    _logger.LogWarning("No results for current request!!!");
            }
            return result;
        }

        /// <summary>
        /// Get brands by specified Product in User context
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        [HttpGet("byproduct/{productId:int}")]
        public IEnumerable<Domain.Models.Brand> GetBrandsByProduct(int productId)
        {
            IEnumerable<Domain.Models.Brand> result = null;
            try
            {
                _logger.LogInformation("BEGIN GetBrandsByProduct");
                result = LactafarmaService.GetBrandsByProduct(productId);
                _logger.LogInformation("END GetBrandsByProduct");
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    $"Exception on JsonResult called GetBrandsByProduct(productId={productId}) with message {ex.Message}");
            }
            finally
            {
                if (result == null)
                    _logger.LogWarning("No results for current request!!!");
            }

            return result;
        }

        /// <summary>
        /// Get detailed information about brand requested
        /// </summary>
        /// <param name="brandId"></param>
        /// <returns></returns>
        [HttpGet("{brandId:int}")]
        public Domain.Models.Brand GetBrand(int brandId)
        {
            Domain.Models.Brand result = null;
            try
            {
                _logger.LogInformation("BEGIN GetBrand");
                result = LactafarmaService.GetBrand(brandId);
                _logger.LogInformation("END GetBrand");
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    $"Exception on JsonResult called GetBrand(brandId={brandId}) with message {ex.Message}");
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