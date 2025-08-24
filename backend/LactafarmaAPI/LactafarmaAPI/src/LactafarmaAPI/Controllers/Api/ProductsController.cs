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
    /// Products handler class
    /// </summary>
    public class ProductsController : BaseController, IProductsController
    {
        #region Private Properties

        private readonly ILogger<ProductsController> _logger;

        #endregion

        #region Constructors

        /// <summary>
        /// Products handler constructor
        /// </summary>
        /// <param name="lactafarmaService"></param>
        /// <param name="mailService"></param>
        /// <param name="config"></param>
        /// <param name="logger"></param>
        /// <param name="cache"></param>
        /// <param name="userManager"></param>
        public ProductsController(ILactafarmaService lactafarmaService, IMailService mailService,
            IConfigurationRoot config,
            ILogger<ProductsController> logger, IMemoryCache cache, UserManager<Data.Entities.User> userManager) : base(
            lactafarmaService, mailService, config, cache, userManager)
        {
            _logger = logger;
            CacheInitialize(lactafarmaService.GetAllProducts(), EntityType.Product);
        }

        #endregion

        #region Public Methods

        /// <summary>
        /// Get first 7 coincidences on Products collection
        /// </summary>
        /// <param name="startsWith"></param>
        /// <returns></returns>
        [HttpGet("byname/{startsWith}")]
        public IEnumerable<Domain.Models.Product> GetProductsByName(string startsWith)
        {
            IEnumerable<Domain.Models.Product> result = null;
            try
            {
                _logger.LogInformation("BEGIN GetProductsByName");

                if (startsWith.Length < 1)
                {
                    _logger.LogWarning("Call to the API without any letter!!");
                    return null;
                }

                Cache.TryGetValue(EntityType.Product, out IEnumerable<Domain.Models.Product> products);

                result = products
                    .Where(a => a.VirtualName.IndexOf(startsWith.RemoveDiacritics(),
                                    StringComparison.CurrentCultureIgnoreCase) !=
                                -1).Take(7);

                _logger.LogInformation("END GetProductsByName");
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    $"Exception on JsonResult called GetProductsByName(name={startsWith}) with message {ex.Message}");
            }
            finally
            {
                if (result == null)
                    _logger.LogWarning("No results for current request!!!");
            }
            return result;
        }

        /// <summary>
        /// Get list of products by provided group
        /// </summary>
        /// <param name="groupId"></param>
        /// <returns></returns>
        [HttpGet("bygroup/{groupId:int}")]
        public IEnumerable<Domain.Models.Product> GetProductsByGroup(int groupId)
        {
            IEnumerable<Domain.Models.Product> result = null;
            try
            {
                _logger.LogInformation("BEGIN GetProductsByGroup");
                result = LactafarmaService.GetProductsByGroup(groupId);
                _logger.LogInformation("END GetProductsByGroup");
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    $"Exception on JsonResult called GetProductsByGroup(groupId={groupId}) with message {ex.Message}");
            }
            finally
            {
                if (result == null)
                    _logger.LogWarning("No results for current request!!!");
            }
            return result;
        }

        /// <summary>
        /// Get list of products by provided brand
        /// </summary>
        /// <param name="brandId"></param>
        /// <returns></returns>
        [HttpGet("bybrand/{brandId:int}")]
        public IEnumerable<Domain.Models.Product> GetProductsByBrand(int brandId)
        {
            IEnumerable<Domain.Models.Product> result = null;
            try
            {
                _logger.LogInformation("BEGIN GetProductsByBrand");
                result = LactafarmaService.GetProductsByBrand(brandId);
                _logger.LogInformation("END GetProductsByBrand");
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    $"Exception on JsonResult called GetProductsByBrand(brandId={brandId}) with message {ex.Message}");
            }
            finally
            {
                if (result == null)
                    _logger.LogWarning("No results for current request!!!");
            }
            return result;
        }

        /// <summary>
        /// Get list of alternatives by provided Product
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        [HttpGet("alternatives/{productId:int}")]
        public IEnumerable<Domain.Models.Product> GetAlternativesByProduct(int productId)
        {
            IEnumerable<Domain.Models.Product> result = null;
            try
            {
                _logger.LogInformation("BEGIN GetAlternativesByProduct");
                result = LactafarmaService.GetAlternativesByProduct(productId);
                _logger.LogInformation("END GetAlternativesByProduct");
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    $"Exception on JsonResult called GetAlternativesByProduct(productId={productId}) with message {ex.Message}");
            }
            finally
            {
                if (result == null)
                    _logger.LogWarning("No results for current request!!!");
            }
            return result;
        }

        /// <summary>
        /// Get list of products by provided alias
        /// </summary>
        /// <param name="aliasId"></param>
        /// <returns></returns>
        [HttpGet("byalias/{aliasId:int}")]
        public Domain.Models.Product GetProductByAlias(int aliasId)
        {
            Domain.Models.Product result = null;
            try
            {
                _logger.LogInformation("BEGIN GetProductByAlias");
                result = LactafarmaService.GetProductByAlias(aliasId);
                _logger.LogInformation("END GetProductByAlias");
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    $"Exception on JsonResult called GetProductByAlias(aliasId={aliasId}) with message {ex.Message}");
            }
            finally
            {
                if (result == null)
                    _logger.LogWarning("No results for current request!!!");
            }
            return result;
        }

        /// <summary>
        /// Get detailed information about Product requested
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        [HttpGet("{productId:int}")]
        public Domain.Models.Product GetProduct(int productId)
        {
            Domain.Models.Product result = null;
            try
            {
                _logger.LogInformation("BEGIN GetProduct");
                result = LactafarmaService.GetProduct(productId);
                _logger.LogInformation("END GetProduct");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception on JsonResult called GetProduct(productId={productId}) with message {ex.Message}");
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