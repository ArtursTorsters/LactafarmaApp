using System;
using LactafarmaAPI.Controllers.Api.Base;
using LactafarmaAPI.Controllers.Api.Interfaces;
using LactafarmaAPI.Data.Entities;
using LactafarmaAPI.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;

namespace LactafarmaAPI.Controllers.Api
{
    /// <summary>
    /// Alerts Controller
    /// </summary>
    public class AlertsController : BaseController, IAlertsController
    {
        #region Private Properties

        private readonly ILogger<AlertsController> _logger;

        #endregion

        #region Constructors
        /// <summary>
        /// Alerts handler constructor
        /// </summary>
        /// <param name="lactafarmaService"></param>
        /// <param name="mailService"></param>
        /// <param name="config"></param>
        /// <param name="logger"></param>
        /// <param name="cache"></param>
        /// <param name="userManager"></param>
        public AlertsController(ILactafarmaService lactafarmaService, IMailService mailService,
            IConfigurationRoot config,
            ILogger<AlertsController> logger, IMemoryCache cache, UserManager<User> userManager) : base(lactafarmaService, mailService, config, cache, userManager)
        {
            _logger = logger;

            //CacheInitialize(lactafarmaService.GetAllAlerts());
        }

        #endregion

        #region Public Methods
        /// <summary>
        /// Get alerts by specified Product in User context
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        [HttpGet("byproduct/{productId:int}")]
        public IEnumerable<Domain.Models.Alert> GetAlertsByProduct(int productId)
        {
            IEnumerable<Domain.Models.Alert> result = null;
            try
            {
                _logger.LogInformation("BEGIN GetAlertsByProduct");
                result = LactafarmaService.GetAlertsByProduct(productId);
                _logger.LogInformation("END GetAlertsByProduct");
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    $"Exception on JsonResult called GetAlertsByProduct(productId={productId}) with message {ex.Message}");
            }
            finally
            {
                if (result == null)
                    _logger.LogWarning("No results for current request!!!");
            }
            return result;
        }

        /// <summary>
        /// Get alerts by specified Product in User context
        /// </summary>
        /// <returns></returns>
        [HttpGet("last")]
        public IEnumerable<Domain.Models.Alert> GetLastAlerts()
        {
            IEnumerable<Domain.Models.Alert> result = null;
            try
            {
                _logger.LogInformation("BEGIN GetLastAlerts");
                result = LactafarmaService.GetLastAlerts();
                _logger.LogInformation("END GetLastAlerts");
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    $"Exception on JsonResult called GetLastAlerts with message {ex.Message}");
            }
            finally
            {
                if (result == null)
                    _logger.LogWarning("No results for current request!!!");
            }
            return result;
        }

        /// <summary>
        /// Get alert by specified Id
        /// </summary>
        /// <param name="alertId"></param>
        /// <returns></returns>
        [HttpGet("{alertId:int}")]
        public Domain.Models.Alert GetAlert(int alertId)
        {
            Domain.Models.Alert result = null;
            try
            {
                _logger.LogInformation("BEGIN GetAlert");
                result = LactafarmaService.GetAlert(alertId);
                _logger.LogInformation("END GetAlert");
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    $"Exception on JsonResult called GetAlert with message {ex.Message}");
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