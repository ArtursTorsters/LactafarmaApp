using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using LactafarmaAPI.Data.Entities;
using LactafarmaAPI.Domain.Models.Base;
using LactafarmaAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace LactafarmaAPI.Controllers.Api.Base
{
    /// <summary>
    /// Base handler class
    /// </summary>
    [Authorize]
    [Route("api/v1/[controller]")]
    [Produces("application/json")]
    public class BaseController: Controller
    {
        /// <summary>
        /// ConfigurationRoot container
        /// </summary>
        public readonly IConfigurationRoot Config;
        /// <summary>
        /// LactafarmaService 
        /// </summary>
        public readonly ILactafarmaService LactafarmaService;
        /// <summary>
        /// MailService
        /// </summary>
        public readonly IMailService MailService;
        /// <summary>
        /// UserManager for ClaimsPrincipal
        /// </summary>
        public readonly UserManager<User> _userManager;
        /// <summary>
        /// Cache container
        /// </summary>
        public IMemoryCache Cache { get; set; }

        /// <summary>
        /// EntityType for storing data in Cache container
        /// </summary>
        public enum EntityType
        {
            /// <summary>
            /// Alert entity type
            /// </summary>
            Alert,
            /// <summary>
            /// Alias entity type
            /// </summary>
            Alias,
            /// <summary>
            /// Product entity type
            /// </summary>
            Product,
            /// <summary>
            /// Brand entity type
            /// </summary>
            Brand,
            /// <summary>
            /// Group entity type
            /// </summary>
            Group,
            /// <summary>
            /// User entity type
            /// </summary>
            User
        }

        /// <summary>
        /// Base handler constructor
        /// </summary>
        /// <param name="lactafarmaService"></param>
        /// <param name="mailService"></param>
        /// <param name="config"></param>
        /// <param name="cache"></param>
        /// <param name="userManager"></param>
        public BaseController(ILactafarmaService lactafarmaService, IMailService mailService, IConfigurationRoot config, IMemoryCache cache, UserManager<User> userManager)
        {
            LactafarmaService = lactafarmaService;
            MailService = mailService;
            Config = config;
            Cache = cache;
            _userManager = userManager;
        }

        /// <summary>
        /// Storing information on Cache container by type specified by input parameters
        /// </summary>
        /// <typeparam name="TModel"></typeparam>
        /// <param name="items"></param>
        /// <param name="type"></param>
        public void CacheInitialize<TModel>(IEnumerable<TModel> items, EntityType type) where TModel : BaseModel
        {
            // Set cache options.
            var cacheEntryOptions = new MemoryCacheEntryOptions()
                // Keep in cache on same state, NeverRemove
                .SetPriority(CacheItemPriority.NeverRemove)
                .SetSlidingExpiration(TimeSpan.FromDays(7));

            IEnumerable<TModel> cacheEntries;

            if (!Cache.TryGetValue(type, out cacheEntries))
            {
                // Key not in cache, so get data.
                cacheEntries = items;

                // Save data in cache.
                Cache.Set(type, cacheEntries, cacheEntryOptions);
            }
        }        
    }
}
