using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using NHibernate;
using NHibernate.Cfg;

namespace web.any.docopy
{
    public class DataConfig
    {
        private static ISessionFactory _sessionFactory;
        private static bool _startupComplete = false;
        private static readonly object _locker = new object();

        public static ISession GetSession()
        {
            ISession session = _sessionFactory.OpenSession();
            session.BeginTransaction();
            return session;
        }

        public static void EnsureStartup()
        {
            if (!_startupComplete)
            {
                lock (_locker)
                {
                    if (!_startupComplete)
                    {
                        DataConfig.PerformStartup();
                        _startupComplete = true;
                    }
                }
            }
        }

        private static void PerformStartup()
        {
            InitializeSessionFactory();
        }

        private static void InitializeSessionFactory()
        {
            _sessionFactory = new Configuration().Configure().BuildSessionFactory();
        }
    }
}