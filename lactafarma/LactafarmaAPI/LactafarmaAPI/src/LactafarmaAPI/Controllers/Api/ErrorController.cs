using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace LactafarmaAPI.Controllers.Api
{
    /// <summary>
    /// Errors handler class
    /// </summary>
    [Authorize]
    public class ErrorController : Controller
    {
        #region Private Properties

        private readonly ILogger<ErrorController> _logger;

        #endregion

        #region Constructors

        /// <summary>
        /// Errors handler constructor
        /// </summary>
        /// <param name="logger"></param>
        public ErrorController(ILogger<ErrorController> logger)
        {
            _logger = logger;
        }

        #endregion

        #region Public Methods

        /// <summary>
        /// Handling errors (Not Found requests)
        /// </summary>
        /// <returns></returns>
        [HttpGet("{*url}", Order = 999)]
        public IActionResult TraceError()
        {
            IActionResult result = null;
            try
            {
                _logger.LogCritical("Page Not Found");
                result = BadRequest("Invalid Resource");
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    $"Exception on IActionResult called TraceError with message {ex.Message}");
            }

            return result;
        }

        #endregion
    }
}