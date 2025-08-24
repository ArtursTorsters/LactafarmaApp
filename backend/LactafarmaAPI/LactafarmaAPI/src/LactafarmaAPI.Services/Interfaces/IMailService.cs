using System.Threading.Tasks;

namespace LactafarmaAPI.Services.Interfaces
{
    public interface IMailService
    {
        #region Public Methods

        Task SendEmailAsync(string email, string subject, string message);


        #endregion
    }
}