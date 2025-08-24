using System.Diagnostics;
using System.Threading.Tasks;
using LactafarmaAPI.Services.Interfaces;

namespace LactafarmaAPI.Services.Services
{
    public class DebugMailService : IMailService
    {

        #region Public Methods
        public Task SendEmailAsync(string email, string subject, string message)
        {
            Debug.WriteLine($"Sending Mail: To: {email} From: info@bebemundi.com Subject: {subject} Body: {message}");

            return null;
        }

        #endregion
    }
}