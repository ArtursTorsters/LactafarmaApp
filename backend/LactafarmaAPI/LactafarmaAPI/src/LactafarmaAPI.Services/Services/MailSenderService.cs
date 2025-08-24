using LactafarmaAPI.Services.Interfaces;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace LactafarmaAPI.Services.Services
{
    public class MailSenderService: IMailService
    {
        public async Task SendEmailAsync(string email, string subject, string message)
        {        
            var emailMessage = new MimeMessage();

            emailMessage.From.Add(new MailboxAddress("info", "info@bebemundi.com"));
            emailMessage.To.Add(new MailboxAddress("", email));
            emailMessage.Subject = subject;

            var bodyBuilder = new BodyBuilder();
            bodyBuilder.HtmlBody = message;
            emailMessage.Body = bodyBuilder.ToMessageBody();

            using (var client = new SmtpClient())
            {
                //TODO: Secure connection
                //client.LocalDomain = "lactafarma.bebemundi.com";
                await client.ConnectAsync("mail.bebemundi.com", 587, SecureSocketOptions.None).ConfigureAwait(false);
                await client.AuthenticateAsync("info@bebemundi.com", "Xpertpoint91$");
                await client.SendAsync(emailMessage).ConfigureAwait(false);
                await client.DisconnectAsync(true).ConfigureAwait(false);
            }
        }
    }
}
