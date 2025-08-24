using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace LactafarmaAPI.ViewModels
{
    /// <summary>
    /// VerifyCode
    /// </summary>
    public class VerifyCodeViewModel
    {
        /// <summary>
        /// Provider
        /// </summary>
        [Required]
        public string Provider { get; set; }

        /// <summary>
        /// Code
        /// </summary>
        [Required]
        public string Code { get; set; }

        /// <summary>
        /// ReturnUrl
        /// </summary>
        public string ReturnUrl { get; set; }

        /// <summary>
        /// RememberBrowser
        /// </summary>
        [Display(Name = "Remember this browser?")]
        public bool RememberBrowser { get; set; }

        /// <summary>
        /// RememberMe
        /// </summary>
        [Display(Name = "Remember me?")]
        public bool RememberMe { get; set; }
    }
}
