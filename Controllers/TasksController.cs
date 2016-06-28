using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using NHibernate.Collection.Generic;
using System.IO;

namespace web.any.docopy.Controllers
{
    public class TasksController : Controller
    {
        public ActionResult List(int? categoryId)
        {
            var session = DataConfig.GetSession();
            List<Domain.Category> categories;
            if (categoryId != null)
            {
                categories = new List<Domain.Category>();
                categories.Add(session.Load<Domain.Category>(categoryId));
            }
            else
            {
                categories = session.CreateQuery(
                      "from Category as c")
                    .List<Domain.Category>()
                    .ToList();
            }
            return Json(categories.Select(c => new
                {
                    Id = c.Id,
                    Tasks = c.Tasks.Select(t => new
                    {
                        Id = t.Id,
                        Name = t.Name,
                        Completed = t.Completed,
                        Priority = t.Priority,
                        DateTime = t.DateTime,
                        Subtasks = GetJsonSubtasks(t)
                    })
                }), JsonRequestBehavior.AllowGet);
        }

        public ActionResult Add(string name, DateTime? dateTime, bool priority, int categoryId)
        {
            var session = DataConfig.GetSession();
            var task = new Domain.Task
            {
                Name = name,
                DateTime = dateTime,
                Priority = priority,
                Category = session.Load<Domain.Category>(categoryId),
                Notes = "",
                Subtasks = new HashSet<Domain.Subtask>()
            };
            session.SaveOrUpdate(task);
            session.Transaction.Commit();
            return Json(new
            {
                Id = task.Id,
                Name = task.Name,
                Completed = task.Completed,
                Priority = task.Priority,
                DateTime = task.DateTime,
                CategoryId = task.Category.Id,
                Subtasks = GetJsonSubtasks(task)
            });
        }

        public ActionResult Update(int id, string name, bool completed, bool priority, DateTime? dateTime,
            int categoryId)
        {
            var session = DataConfig.GetSession();
            var task = session.Load<Domain.Task>(id);
            task.Name = name;
            task.Completed = completed;
            task.Priority = priority;
            task.DateTime = dateTime;
            var category = session.Load<Domain.Category>(categoryId);
            task.Category.Tasks.Remove(task);
            task.Category = category;
            category.Tasks.Add(task);
            session.SaveOrUpdate(task);
            session.Transaction.Commit();
            return Json(new
            {
                Id = task.Id,
                Name = task.Name,
                Completed = task.Completed,
                Priority = task.Priority,
                DateTime = task.DateTime,
                CategoryId = task.Category.Id,
                Subtasks = GetJsonSubtasks(task)
            });
        }

        public ActionResult Delete(int id)
        {
            var session = DataConfig.GetSession();
            var task = session.Load<Domain.Task>(id);
            task.Category.Tasks.Remove(task);
            task.DeleteFiles(Server.MapPath("~"));
            session.Delete(task);
            session.Transaction.Commit();
            return Json(new
            {
                Id = id
            });
        }

        public ActionResult LoadNotes(int id)
        {
            var session = DataConfig.GetSession();
            var task = session.Load<Domain.Task>(id);
            return Json(new
            {
                Notes = task.Notes
            });
        }

        public ActionResult UpdateNotes(int id, string notes)
        {
            var session = DataConfig.GetSession();
            var task = session.Load<Domain.Task>(id);
            task.Notes = notes;
            session.SaveOrUpdate(task);
            session.Transaction.Commit();
            return Json(new
            {
            });
        }

        public ActionResult AddSubtask(int taskId, string name)
        {
            var session = DataConfig.GetSession();
            var task = session.Load<Domain.Task>(taskId);
            var subtask = new Domain.Subtask
            {
                Name = name,
                Task = task
            };
            task.Subtasks.Add(subtask);
            session.SaveOrUpdate(subtask);
            session.Transaction.Commit();
            return Json(new
            {
                Id = subtask.Id,
                Name = subtask.Name,
                Completed = subtask.Completed
            });
        }

        public ActionResult UpdateSubtask(int subtaskId, string name, bool completed)
        {
            var session = DataConfig.GetSession();
            var subtask = session.Load<Domain.Subtask>(subtaskId);
            subtask.Name = name;
            subtask.Completed = completed;
            session.SaveOrUpdate(subtask);
            session.Transaction.Commit();
            return Json(new
            {
                Name = subtask.Name,
                Completed = subtask.Completed
            });
        }

        public ActionResult DeleteSubtask(int taskId, int subtaskId)
        {
            var session = DataConfig.GetSession();
            var task = session.Load<Domain.Task>(taskId);
            var subtask = task.Subtasks.First(st => st.Id == subtaskId);
            task.Subtasks.Remove(subtask);
            session.Delete(subtask);
            session.Transaction.Commit();
            return Json(new
            {
            });
        }

        public ActionResult SendEmails(int taskId, string[] emails)
        {
            var session = DataConfig.GetSession();
            var task = session.Load<Domain.Task>(taskId);
            Classes.MailSender mailSender = new Classes.MailSender();
            mailSender.SendMail(task.Name, string.Format("You have been invited to: {0}.", task.Name),
                emails);
            return Json(new 
            {
            });
        }

        private IEnumerable<object> GetJsonSubtasks(Domain.Task task)
        {
            return task.Subtasks.Select(st => new
            {
                Id = st.Id,
                Name = st.Name,
                Completed = st.Completed
            });
        }
    }
}
