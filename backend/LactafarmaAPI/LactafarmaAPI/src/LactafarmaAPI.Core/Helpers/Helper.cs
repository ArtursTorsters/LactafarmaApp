using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace LactafarmaAPI.Core
{
    public static class Helper
    {
        #region Public Methods

        public static int CombineHashCodes(IEnumerable<object> objs)
        {
            unchecked
            {
                var hash = 17;
                foreach (var obj in objs)
                    hash = hash * 23 + (obj != null ? obj.GetHashCode() : 0);
                return hash;
            }
        }

        /// <summary>
        ///     Extension method for custom property placed on IdentityUser entity
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public static Guid LanguageId(this ClaimsPrincipal user)
        {
            if (user.Identity.IsAuthenticated)
                return Guid.Parse(user.Claims.FirstOrDefault(v => v.Type == ClaimTypes.Country).Value);

            return Guid.Empty;
        }

        #endregion
    }
}