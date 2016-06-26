using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using NHibernate.Collection.Generic;

namespace web.any.docopy.Domain
{
    public class Task
    {
        public virtual int Id { get; set; }

        public virtual string Name { get; set; }

        public virtual DateTime? DateTime { get; set; }

        public virtual bool Completed { get; set; }

        public virtual bool Priority { get; set; }

        public virtual string Notes { get; set; }

        public virtual Category Category { get; set; }

        public virtual ISet<Subtask> Subtasks { get; set; }

        public virtual ISet<Attachment> Attachments { get; set; }

        public virtual void DeleteFiles(string pathToDirectory)
        {
            foreach (var attachment in Attachments)
            {
                attachment.DeleteFile(pathToDirectory);
            }
        }
    }
}