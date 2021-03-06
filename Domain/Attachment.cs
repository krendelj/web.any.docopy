﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;

namespace web.any.docopy.Domain
{
    public class Attachment
    {
        public virtual int Id { get; set; }

        public virtual Task Task { get; set; }

        public virtual Guid Guid { get; set; }

        public virtual string FileName { get; set; }

        public virtual string ContentType { get; set; }

        public static string AttachmentsStorageDirectory
        {
            get
            {
                return System.Web.Configuration.WebConfigurationManager.AppSettings["attachmentsStorageDirectory"];
            }
        }

        public virtual void DeleteFile(string rootPath)
        {
            File.Delete(Path.Combine(Path.Combine(rootPath, AttachmentsStorageDirectory), Guid.ToString()));
        }
    }
}