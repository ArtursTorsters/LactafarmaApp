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
    /// Groups handler class
    /// </summary>
    public class GroupsController : BaseController, IGroupsController
    {
        #region Private Properties

        private readonly ILogger<GroupsController> _logger;

        #endregion

        #region Constructors

        /// <summary>
        /// Groups handler constructor
        /// </summary>
        /// <param name="lactafarmaService"></param>
        /// <param name="mailService"></param>
        /// <param name="config"></param>
        /// <param name="logger"></param>
        /// <param name="cache"></param>
        /// <param name="userManager"></param>
        public GroupsController(ILactafarmaService lactafarmaService, IMailService mailService,
            IConfigurationRoot config,
            ILogger<GroupsController> logger, IMemoryCache cache, UserManager<User> userManager) : base(lactafarmaService, mailService, config, cache, userManager)
        {
            _logger = logger;

            CacheInitialize(lactafarmaService.GetAllGroups(), EntityType.Group);
        }

        #endregion

        #region Public Methods

        /// <summary>
        /// Get first 3 coincidences on groups collection
        /// </summary>
        /// <param name="startsWith"></param>
        /// <returns></returns>
        [HttpGet("byname/{startsWith}")]
        public IEnumerable<Domain.Models.Group> GetGroupsByName(string startsWith)
        {
            IEnumerable<Domain.Models.Group> result = null;
            try
            {
                _logger.LogInformation("BEGIN GetGroupsByName");

                if (startsWith.Length < 1)
                {
                    _logger.LogWarning("Call to the API without any letter!!");
                    return null;
                }

                Cache.TryGetValue(EntityType.Group, out IEnumerable<Domain.Models.Group> groups);

                result = groups
                    .Where(a => a.VirtualName.IndexOf(startsWith.RemoveDiacritics(),
                                    StringComparison.CurrentCultureIgnoreCase) !=
                                -1).Take(3);

                _logger.LogInformation("END GetGroupsByName");
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    $"Exception on JsonResult called GetGroupsByName(name={startsWith}) with message {ex.Message}");
            }
            finally
            {
                if (result == null)
                    _logger.LogWarning("No results for current request!!!");
            }
            return result;
        }

        /// <summary>
        /// Get groups by specified Product in User context
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        [HttpGet("byproduct/{productId:int}")]
        public IEnumerable<Domain.Models.Group> GetGroupsByProduct(int productId)
        {
            IEnumerable<Domain.Models.Group> result = null;
            try
            {
                _logger.LogInformation("BEGIN GetGroupsByProduct");
                result = LactafarmaService.GetGroupsByProduct(productId);
                _logger.LogInformation("END GetGroupsByProduct");
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    $"Exception on JsonResult called GetGroupsByProduct(productId={productId}) with message {ex.Message}");
            }
            finally
            {
                if (result == null)
                    _logger.LogWarning("No results for current request!!!");
            }

            return result;
        }

        /// <summary>
        /// Get detailed information about group requested
        /// </summary>
        /// <param name="groupId"></param>
        /// <returns></returns>
        [HttpGet("{groupId:int}")]
        public Domain.Models.Group GetGroup(int groupId)
        {
            Domain.Models.Group result = null;
            try
            {
                _logger.LogInformation("BEGIN GetGroup");
                result = LactafarmaService.GetGroup(groupId);
                _logger.LogInformation("END GetGroup");
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    $"Exception on JsonResult called GetGroup(groupId={groupId}) with message {ex.Message}");
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