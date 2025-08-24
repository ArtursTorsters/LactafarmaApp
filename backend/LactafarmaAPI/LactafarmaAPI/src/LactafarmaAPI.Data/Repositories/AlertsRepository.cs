using LactafarmaAPI.Core;
using LactafarmaAPI.Data.Entities;
using LactafarmaAPI.Data.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace LactafarmaAPI.Data.Repositories
{
    public class AlertsRepository : DataRepositoryBase<Alert, LactafarmaContext>, IAlertRepository
    {
        private readonly ILogger<AlertsRepository> _logger;

        public AlertsRepository(LactafarmaContext context, ILogger<AlertsRepository> logger, IHttpContextAccessor httpContext): base(context, httpContext)
        {
            _logger = logger;
        }

        public IEnumerable<Alert> GetLastAlerts()
        {
            try
            {
                return EntityContext.Alerts
                    .Include(e => e.Product).ThenInclude(d => d.ProductsMultilingual)
                    .Include(e => e.OldRisk)
                    .ThenInclude(e => e.RisksMultilingual)
                    .Include(e => e.NewRisk)
                    .ThenInclude(e => e.RisksMultilingual).OrderByDescending(e => e.Created).Take(50)
                    .AsEnumerable();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception on GetLastAlerts with message: {ex.Message}");
                return null;
            }
        }

        public IEnumerable<Alert> GetAlertsByProduct(int productId)
        {
            try
            {
                return EntityContext.Alerts
                    .Include(d => d.Product).ThenInclude(d => d.ProductsMultilingual).Where(d => d.Product.Id == productId).Include(e => e.OldRisk)
                    .ThenInclude(e => e.RisksMultilingual)
                    .Include(e => e.NewRisk)
                    .ThenInclude(e => e.RisksMultilingual).OrderByDescending(e => e.Created).Take(2)
                    .AsEnumerable();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception on GetAlertsByProduct with message: {ex.Message}");
                return null;
            }
        }

        /// <summary>
        /// Get alert by id
        /// </summary>
        /// <param name="alertId"></param>
        /// <returns></returns>
        public Alert GetAlert(int alertId)
        {
            return EntityContext.Alerts.Where(a => a.Id == alertId).Include(d => d.Product).ThenInclude(d => d.ProductsMultilingual).Include(e => e.OldRisk)
                    .ThenInclude(e => e.RisksMultilingual)
                    .Include(e => e.NewRisk)
                    .ThenInclude(e => e.RisksMultilingual).FirstOrDefault();
        }

        protected override Expression<Func<Alert, bool>> IdentifierPredicate(int id)
        {
            return (e => e.Id == id);
        }       
    }
}
