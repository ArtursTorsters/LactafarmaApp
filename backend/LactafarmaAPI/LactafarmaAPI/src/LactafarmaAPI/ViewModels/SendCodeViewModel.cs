using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LactafarmaAPI.ViewModels
{
    /// <summary>
    /// Send Code
    /// </summary>
    public class SendCodeViewModel
    {
        /// <summary>
        /// Selected Provider
        /// </summary>
        public string SelectedProvider { get; set; }

        /// <summary>
        /// Providers
        /// </summary>
        public ICollection<SelectListItem> Providers { get; set; }

        /// <summary>
        /// ReturnUrl
        /// </summary>
        public string ReturnUrl { get; set; }

        /// <summary>
        /// RememberMe
        /// </summary>
        public bool RememberMe { get; set; }
    }
}
