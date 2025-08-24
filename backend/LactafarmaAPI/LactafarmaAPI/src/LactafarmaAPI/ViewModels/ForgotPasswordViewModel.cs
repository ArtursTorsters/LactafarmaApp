using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace LactafarmaAPI.ViewModels
{
    /// <summary>
    /// Forgot Password
    /// </summary>
    public class ForgotPasswordViewModel
    {
        /// <summary>
        /// Email
        /// </summary>
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
