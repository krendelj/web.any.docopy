using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;

namespace web.any.docopy.Controllers
{
    public class CategoriesController : Controller
    {

        public ActionResult List()
        {
            var session = DataConfig.GetSession();
            var categories = session.CreateQuery(
                  "from Category as c")
                .List<Domain.Category>();
            return Json(categories.Select(c => new
                {
                    Id = c.Id,
                    Name = c.Name
                }), JsonRequestBehavior.AllowGet);
        }

        public ActionResult Add(string name)
        {
            var session = DataConfig.GetSession();
            var category = new Domain.Category();
            category.Name = name;
            session.SaveOrUpdate(category);
            session.Transaction.Commit();
            return Json(new
            {
                Id = category.Id
            });
        }

        public ActionResult Update(int id, string name)
        {
            var session = DataConfig.GetSession();
            var category = session.Load<Domain.Category>(id);
            category.Name = name;
            session.SaveOrUpdate(category);
            session.Transaction.Commit();
            return Json(new
            {
            });
        }

        public ActionResult Delete(int id)
        {
            var session = DataConfig.GetSession();
            var category = session.Load<Domain.Category>(id);
            category.DeleteFiles(Server.MapPath("~"));
            while (category.Tasks.Count > 0)
            {
                var task = category.Tasks.First();
                task.Category = null;
                category.Tasks.Remove(task);
                session.Delete(task);
            }
            session.Delete(category);
            session.Transaction.Commit();
            return Json(new
            {
            });
        }
    }
}
