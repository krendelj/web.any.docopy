using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;

namespace web.any.docopy.Controllers
{
    public class AttachmentsController : Controller
    {
        public ActionResult List(int taskId)
        {
            var session = DataConfig.GetSession();
            var task = session.Load<Domain.Task>(taskId);
            return Json(task.Attachments.Select(a => new
            {
                Id = a.Id,
                FileName = a.FileName
            }));
        }

        public ActionResult Upload(int taskId, HttpPostedFileBase files)
        {
            var session = DataConfig.GetSession();
            var task = session.Load<Domain.Task>(taskId);
            var attachment = new Domain.Attachment
            {
                Task = task,
                FileName = files.FileName,
                ContentType = files.ContentType,
                Guid = Guid.NewGuid()
            };
            var path = Path.Combine(Server.MapPath("~/public"), attachment.Guid.ToString());
            files.SaveAs(path);
            task.Attachments.Add(attachment);
            session.SaveOrUpdate(attachment);
            session.Transaction.Commit();
            return Json(new
            {
                Id = attachment.Id,
                FileName = attachment.FileName
            });
        }

        public ActionResult Download(int id)
        {
            var session = DataConfig.GetSession();
            var attachment = session.Load<Domain.Attachment>(id);
            return File(Path.Combine(Server.MapPath("~/public"), attachment.Guid.ToString()),
                attachment.ContentType,
                attachment.FileName);
        }

        public ActionResult Delete(int id)
        {
            var session = DataConfig.GetSession();
            var attachment = session.Load<Domain.Attachment>(id);
            attachment.DeleteFile(Server.MapPath("~/public"));
            attachment.Task.Attachments.Remove(attachment);
            session.Delete(attachment);
            session.Transaction.Commit();
            return Json(new
            {
            });
        }
    }
}
