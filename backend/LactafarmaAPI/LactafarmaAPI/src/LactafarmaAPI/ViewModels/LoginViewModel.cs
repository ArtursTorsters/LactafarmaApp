using System.ComponentModel.DataAnnotations;

namespace LactafarmaAPI.ViewModels
{
  /// <summary>
  /// Login class for users accesing to LactafarmaApi
  /// </summary>
  public class LoginViewModel
  {
    /// <summary>
    /// Login UserName
    /// </summary>
    [Required]
    public string UserName { get; set; }
    
    /// <summary>
    /// Login Password
    /// </summary>
    [Required]
    public string Password { get; set; }

  }
}
