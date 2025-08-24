using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace LactafarmaAPI.ViewModels
{
    /// <summary>
    /// Register ViewModel
    /// </summary>
    public class RegisterViewModel
    {
        /// <summary>
        /// Register Email
        /// </summary>
        [Required]
        [EmailAddress]
        [Display(Name = "Email")]
        public string Email { get; set; }

        /// <summary>
        /// Register Password
        /// </summary>
        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        /// <summary>
        /// Register Confirm Password
        /// </summary>
        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }

        /// <summary>
        /// Register Language property
        /// </summary>
        public Guid LanguageId { get; set; }

        /// <summary>
        /// List of available languages
        /// </summary>
        public List<Language> Languages { get; set; }

        /// <summary>
        /// List of Errors concatenated
        /// </summary>
        public string Error { get; set; }
    }

    /// <summary>
    /// Language class
    /// </summary>
    public class Language
    {
        /// <summary>
        /// Language identifier
        /// </summary>
        public Guid Id { get; set; }
        /// <summary>
        /// Language Name
        /// </summary>
        public string Name { get; set; }
    }
}
