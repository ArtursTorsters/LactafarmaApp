using System;
using System.Threading.Tasks;
using LactafarmaAPI.Controllers.Api.Base;
using LactafarmaAPI.Data.Entities;
using LactafarmaAPI.Data.PagedData;
using LactafarmaAPI.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace LactafarmaAPI.Controllers.Api
{
    /// <summary>
    /// Logs handler class
    /// </summary>
    public class LogController : BaseController
    {
        #region Private Properties

        private readonly ILogger<LogController> _logger;
        private readonly IMailService _mailService;

        #endregion

        #region Constructors

        /// <summary>
        /// Logs handler constructor
        /// </summary>
        /// <param name="lactafarmaService"></param>
        /// <param name="mailService"></param>
        /// <param name="config"></param>
        /// <param name="logger"></param>
        /// <param name="cache"></param>
        /// <param name="userManager"></param>
        public LogController(ILactafarmaService lactafarmaService, IMailService mailService,
            IConfigurationRoot config, ILogger<LogController> logger, IMemoryCache cache, UserManager<User> userManager) : base(lactafarmaService, mailService, config, cache, userManager)
        {
            _logger = logger;
            _mailService = mailService;
        }

        #endregion

        #region Public Methods

        /// <summary>
        /// Get all different log levels currently available
        /// </summary>
        /// <returns></returns>
        [HttpGet("levels")]
        public async Task<IActionResult> GetLevels()
        {
            var result = new JsonResult(false);
            try
            {
                _logger.LogInformation("BEGIN GetLevels");
                var availableLevels = await LactafarmaService.GetLevelsAsync();
                result = Json(availableLevels);
                _logger.LogInformation("END GetLevels");
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    $"Exception on JsonResult called GetLevels with message {ex.Message}");
            }
            finally
            {
                if (result == null)
                    _logger.LogWarning("No results for current request!!!");
            }

            return result;
        }


        /// <summary>
        /// Get logs with Error level specified on last 7 days
        /// </summary>
        /// <returns></returns>
        
        [HttpGet("error")]
        public async Task<IActionResult> GetErrorLogs()
        {
            IActionResult result = null;
            try
            {
                _logger.LogInformation("BEGIN GetErrorLogs");
                var logs = await LactafarmaService.GetLogsAsync(new LogPagedDataRequest
                {
                    FromDate = DateTime.Now.Subtract(TimeSpan.FromDays(7)),
                    ToDate = DateTime.Now,
                    Level = "Error",
                    PageSize = 100
                });
                result = Json(logs);

                await _mailService.SendEmailAsync("xpertpoint.solutions@gmail.com", "Logs information was requested - ERROR", $"User {User.Identity.Name} has requested log data");

                _logger.LogInformation("END GetErrorLogs");
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    $"Exception on JsonResult called GetErrorLogs with message {ex.Message}");
            }
            finally
            {
                if (result == null)
                    _logger.LogWarning("No results for current request!!!");
            }

            return result;
        }

        /// <summary>
        /// Get logs with Warn level specified on last 7 days
        /// </summary>
        /// <returns></returns>
        [HttpGet("warn")]
        public async Task<IActionResult> GetWarnLogs()
        {
            IActionResult result = null;
            try
            {
                _logger.LogInformation("BEGIN GetErrorLogs");
                var logs = await LactafarmaService.GetLogsAsync(new LogPagedDataRequest
                {
                    FromDate = DateTime.Now.Subtract(TimeSpan.FromDays(7)),
                    ToDate = DateTime.Now,
                    Level = "Warn",
                    PageSize = 100
                });
                result = Json(logs);

                await _mailService.SendEmailAsync("xpertpoint.solutions@gmail.com", "Logs information was requested - WARN", $"User {User.Identity.Name} has requested log data");
                _logger.LogInformation("END GetErrorLogs");
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    $"Exception on JsonResult called GetErrorLogs with message {ex.Message}");
            }
            finally
            {
                if (result == null)
                    _logger.LogWarning("No results for current request!!!");
            }

            return result;
        }

        /// <summary>
        /// Get logs with Fatal level specified on last 7 days
        /// </summary>
        /// <returns></returns>
        [HttpGet("fatal")]
        public async Task<IActionResult> GetFatalLogs()
        {
            IActionResult result = null;
            try
            {
                _logger.LogInformation("BEGIN GetFatalLogs");
                var logs = await LactafarmaService.GetLogsAsync(new LogPagedDataRequest
                {
                    FromDate = DateTime.Now.Subtract(TimeSpan.FromDays(7)),
                    ToDate = DateTime.Now,
                    Level = "Fatal",
                    PageSize = 100
                });
                result = Json(logs);

                await _mailService.SendEmailAsync("xpertpoint.solutions@gmail.com", "Logs information was requested - FATAL", $"User {User.Identity.Name} has requested log data");

                _logger.LogInformation("END GetFatalLogs");
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    $"Exception on JsonResult called GetFatalLogs with message {ex.Message}");
            }
            finally
            {
                if (result == null)
                    _logger.LogWarning("No results for current request!!!");
            }

            return result;
        }

        /// <summary>
        /// Get logs with Any level specified on last 7 days
        /// </summary>
        /// <returns></returns>
        
        [HttpGet("all")]
        public async Task<IActionResult> GetLogs()
        {
            IActionResult result = null;
            try
            {
                _logger.LogInformation("BEGIN GetLogs");
                var logs = await LactafarmaService.GetLogsAsync(new LogPagedDataRequest
                {
                    FromDate = DateTime.Now.Subtract(TimeSpan.FromDays(7)),
                    ToDate = DateTime.Now,
                    PageSize = 500
                });
                result = Json(logs);

                await _mailService.SendEmailAsync("xpertpoint.solutions@gmail.com", "Logs information was requested - ALL", $"User {User.Identity.Name} has requested log data");

                _logger.LogInformation("END GetLogs");
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    $"Exception on JsonResult called GetLogs with message {ex.Message}");
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