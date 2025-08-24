using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using LactafarmaAPI.Data.Entities;
using LactafarmaAPI.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Language = LactafarmaAPI.ViewModels.Language;
using LactafarmaAPI.Services.Services;
using LactafarmaAPI.Services.Interfaces;

namespace LactafarmaAPI.Controllers.Web
{
    /// <summary>
    /// Account handler constructor
    /// </summary>
    public class AccountController: Controller
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IMailService _emailSender;
        //private readonly ISmsSender _smsSender;
        private readonly ILogger _logger;

        private readonly IMemoryCache _cache;

        /// <summary>
        /// Account handler constructor
        /// </summary>
        /// <param name="userManager"></param>
        /// <param name="signInManager"></param>
        /// <param name="emailSender"></param>
        /// <param name="loggerFactory"></param>
        /// <param name="cache"></param>
        public AccountController(
            UserManager<User> userManager,
            SignInManager<User> signInManager,
            IMailService emailSender,
            //ISmsSender smsSender,
            ILoggerFactory loggerFactory, IMemoryCache cache)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _emailSender = emailSender;
            //_smsSender = smsSender;
            _logger = loggerFactory.CreateLogger<AccountController>();
            _cache = cache;
        }

        /// <summary>
        /// Registration page load
        /// </summary>
        /// <returns></returns>
        [HttpGet("/account/register")]        
        [AllowAnonymous]
        public IActionResult Register()
        {
            var vm = new RegisterViewModel();
            try
            {
                _logger.LogInformation("BEGIN GET Register");
                                
                vm.Languages = new List<Language>
                {
                    new Language
                    {
                        Id = Guid.Parse("7C0AFE0E-0B25-4AEA-8AAE-51CBDDE1B134"),
                        Name = "Spanish"
                    },
                    new Language
                    {
                        Id = Guid.Parse("458AD052-C8AC-486B-A945-FB3A85219448"),
                        Name = "English"
                    }                
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    $"Exception on JsonResult called GET Register with message {ex.Message}");
            }            

            _logger.LogInformation("END GET Register");

            return View(vm);
        }

        
        /// <summary>
        /// Start Registration workflow with requested information
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost("/account/register")]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Register(RegisterViewModel model)
        {
            try
            {
                _logger.LogInformation($"BEGIN POST Register with email {model.Email}");

                if (ModelState.IsValid)
                {
                    var user = new User { UserName = model.Email, Email = model.Email, LanguageId = model.LanguageId };
                    var result = await _userManager.CreateAsync(user, model.Password);
                    if (result.Succeeded)
                    {
                        // For more information on how to enable account confirmation and password reset please visit http://go.microsoft.com/fwlink/?LinkID=532713
                        // Send an email with this link
                        var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                        var callbackUrl = Url.Action("ConfirmEmail", "Account", new { userId = user.Id, code = code }, protocol: HttpContext.Request.Scheme);
                        await _emailSender.SendEmailAsync(model.Email, "Confirm your account",
                            "<html><head></head><body><strong>Please confirm your account by clicking this link: <a href=\"" + callbackUrl + "\">Confirm Lactafarma Api authentication</a></strong></body></html>");
                        await _emailSender.SendEmailAsync("xpertpoint.solutions@gmail.com", "New user registered", $"New user {model.Email} was registered using LactafarmaApi");

                        await _signInManager.SignInAsync(user, isPersistent: false);
                        _logger.LogInformation(3, "User created a new account with password.");
                        return Json("User created succesfully");
                    }
                    else
                    {
                        model.Error = String.Join(" -", result.Errors.Select(e => e.Description).ToArray()); 
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    $"Exception on JsonResult called POST Register with email {model.Email} & message {ex.Message}");
            }

            _logger.LogInformation($"END POST Register with email {model.Email}");

            model.Languages = new List<Language>
                {
                    new Language
                    {
                        Id = Guid.Parse("7C0AFE0E-0B25-4AEA-8AAE-51CBDDE1B134"),
                        Name = "Spanish"
                    },
                    new Language
                    {
                        Id = Guid.Parse("458AD052-C8AC-486B-A945-FB3A85219448"),
                        Name = "English"
                    }
                };

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        /// <summary>
        /// Confirm Email
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="code"></param>
        /// <returns></returns>
        [HttpGet("auth/confirmemail")]
        [AllowAnonymous]
        public async Task<IActionResult> ConfirmEmail(string userId, string code)
        {
            _logger.LogInformation($"BEGIN GET ConfirmEmail with userId {userId}");
            if (userId == null || code == null)
            {
                return Json("Error");
            }
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                _logger.LogError($"Error on GET ConfirmEmail-FindByIdAsync with userId {userId}");
                return Json("Error");
            }
            var result = await _userManager.ConfirmEmailAsync(user, code);
            
            _logger.LogInformation($"END GET ConfirmEmail-ConfirmEmailAsync with userId {userId}");

            if (!result.Succeeded)
                _logger.LogError($"Error on GET ConfirmEmail with userId {userId}");
            else
                await _emailSender.SendEmailAsync("xpertpoint.solutions@gmail.com", "New user confirmed", $"New user {user.Email} was confirmed using LactafarmaApi");

            return Json(result.Succeeded ? "ConfirmEmail" : "Error");
        }

        
        /// <summary>
        /// Forgot Password
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [AllowAnonymous]
        public IActionResult ForgotPassword()
        {
            return View();
        }

        /// <summary>
        /// Forgot Password
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordViewModel model)
        {
            try
            {
                _logger.LogInformation("BEGIN POST ForgotPassword");
                if (ModelState.IsValid)
                {
                    var user = await _userManager.FindByNameAsync(model.Email);
                    if (user == null || !(await _userManager.IsEmailConfirmedAsync(user)))
                    {
                        // Don't reveal that the user does not exist or is not confirmed
                        return Json("ForgotPasswordConfirmation Error");
                    }

                    // For more information on how to enable account confirmation and password reset please visit http://go.microsoft.com/fwlink/?LinkID=532713
                    // Send an email with this link
                    var code = await _userManager.GeneratePasswordResetTokenAsync(user);
                    var callbackUrl = Url.Action("ResetPassword", "Account", new { userId = user.Id, code = code }, protocol: HttpContext.Request.Scheme);
                    await _emailSender.SendEmailAsync(model.Email, "Reset Password",
                       "Please reset your password by clicking here: <a href=\"" + callbackUrl + "\">Confirm LactafarmaApp authorization</a>");

                    await _emailSender.SendEmailAsync("xpertpoint.solutions@gmail.com", "New user forgot password", $"New user {model.Email} forgot password using LactafarmaApi");

                    return Json("ForgotPasswordConfirmation");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception on JsonResult called POST ForgotPassword with email {model.Email} & message {ex.Message}");
            }            

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        /// <summary>
        /// Forgot Password Confirmation
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [AllowAnonymous]
        public IActionResult ForgotPasswordConfirmation()
        {
            return View();
        }

        /// <summary>
        /// Reset Password
        /// </summary>
        /// <param name="code"></param>
        /// <returns></returns>
        [HttpGet("account/resetpassword")]
        [AllowAnonymous]
        public IActionResult ResetPassword(string code = null)
        {
            return code == null ? View("Error") : View();
        }

        /// <summary>
        /// Reset Password
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ResetPassword(ResetPasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }
            var user = await _userManager.FindByNameAsync(model.Email);
            if (user == null)
            {
                // Don't reveal that the user does not exist
                return RedirectToAction(nameof(AccountController.ResetPasswordConfirmation), "Account");
            }
            var result = await _userManager.ResetPasswordAsync(user, model.Code, model.Password);
            if (result.Succeeded)
            {
                return RedirectToAction(nameof(AccountController.ResetPasswordConfirmation), "Account");
            }
            AddErrors(result);
            return View();
        }

        /// <summary>
        /// Reset password confirmation
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [AllowAnonymous]
        public IActionResult ResetPasswordConfirmation()
        {
            return View();
        }

        /// <summary>
        /// Send Code
        /// </summary>
        /// <param name="returnUrl"></param>
        /// <param name="rememberMe"></param>
        /// <returns></returns>
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult> SendCode(string returnUrl = null, bool rememberMe = false)
        {
            var user = await _signInManager.GetTwoFactorAuthenticationUserAsync();
            if (user == null)
            {
                return View("Error");
            }
            var userFactors = await _userManager.GetValidTwoFactorProvidersAsync(user);
            var factorOptions = userFactors.Select(purpose => new SelectListItem { Text = purpose, Value = purpose }).ToList();
            return View(new SendCodeViewModel { Providers = factorOptions, ReturnUrl = returnUrl, RememberMe = rememberMe });
        }


        /// <summary>
        /// Send Code
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SendCode(SendCodeViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View();
            }

            var user = await _signInManager.GetTwoFactorAuthenticationUserAsync();
            if (user == null)
            {
                return View("Error");
            }

            // Generate the token and send it
            var code = await _userManager.GenerateTwoFactorTokenAsync(user, model.SelectedProvider);
            if (string.IsNullOrWhiteSpace(code))
            {
                return View("Error");
            }

            var message = "Your security code is: " + code;
            if (model.SelectedProvider == "Email")
            {
                await _emailSender.SendEmailAsync(await _userManager.GetEmailAsync(user), "Security Code", message);
            }
            //else if (model.SelectedProvider == "Phone")
            //{
            //    await _smsSender.SendSmsAsync(await _userManager.GetPhoneNumberAsync(user), message);
            //}

            return RedirectToAction(nameof(VerifyCode), new { Provider = model.SelectedProvider, ReturnUrl = model.ReturnUrl, RememberMe = model.RememberMe });
        }

        /// <summary>
        /// Verify Code
        /// </summary>
        /// <param name="provider"></param>
        /// <param name="rememberMe"></param>
        /// <param name="returnUrl"></param>
        /// <returns></returns>
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> VerifyCode(string provider, bool rememberMe, string returnUrl = null)
        {
            // Require that the user has already logged in via username/password or external login
            var user = await _signInManager.GetTwoFactorAuthenticationUserAsync();
            if (user == null)
            {
                return View("Error");
            }
            return View(new VerifyCodeViewModel { Provider = provider, ReturnUrl = returnUrl, RememberMe = rememberMe });
        }

        /// <summary>
        /// Verify code
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> VerifyCode(VerifyCodeViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            // The following code protects for brute force attacks against the two factor codes.
            // If a user enters incorrect codes for a specified amount of time then the user account
            // will be locked out for a specified amount of time.
            var result = await _signInManager.TwoFactorSignInAsync(model.Provider, model.Code, model.RememberMe, model.RememberBrowser);
            if (result.Succeeded)
            {
                return RedirectToLocal(model.ReturnUrl);
            }
            if (result.IsLockedOut)
            {
                _logger.LogWarning(7, "User account locked out.");
                return View("Lockout");
            }
            else
            {
                ModelState.AddModelError("", "Invalid code.");
                return View(model);
            }
        }
        #region Helpers

        private void AddErrors(IdentityResult result)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }
        }

        private async Task<User> GetCurrentUserAsync()
        {
            return await _userManager.GetUserAsync(HttpContext.User);
        }

        private IActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            else
            {
                return RedirectToAction(nameof(AuthController.Login), "Auth");
            }
        }

        #endregion
    }
}
