using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net.Mail;

namespace web.any.docopy.Classes
{
    public class MailSender
    {
        public void SendMail(string subject, string body, string[] emails) 
        {
            MailMessage message = new MailMessage();

            foreach (string email in emails)
            {
                message.To.Add(new MailAddress(email));
            }

            message.Subject = subject;
            message.Body = body;

            SmtpClient client = new SmtpClient();
            client.Send(message);
        }
    }
}