using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace web.any.docopy.Controllers
{
    public class SettingsController : Controller
    {
        public ActionResult Load()
        {
            var session = DataConfig.GetSession();
            var settings = session.Load<Domain.Settings>(1);
            return Json(new
            {
                DateFormat = settings.DateFormat
            });
        }

        public ActionResult Save(int dateFormat)
        {
            var session = DataConfig.GetSession();
            var settings = session.Load<Domain.Settings>(1);
            settings.DateFormat = dateFormat;
            session.Save(settings);
            session.Transaction.Commit();
            return Json(new
            {
                DateFormat = settings.DateFormat
            });
        }
    }
}
