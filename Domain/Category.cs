using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using NHibernate.Collection.Generic;

namespace web.any.docopy.Domain
{
    public class Category
    {
        public virtual int Id { get; set; }

        public virtual string Name { get; set; }

        public virtual ISet<Task> Tasks { get; set; }

        public virtual void DeleteFiles(string pathToDirectory)
        {
            foreach (var task in Tasks)
            {
                task.DeleteFiles(pathToDirectory);
            }
        }
    }
}