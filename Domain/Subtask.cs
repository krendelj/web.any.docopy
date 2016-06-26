using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace web.any.docopy.Domain
{
    public class Subtask
    {
        public virtual int Id { get; set; }

        public virtual string Name { get; set; }

        public virtual bool Completed { get; set; }

        public virtual Task Task { get; set; }
    }
}