using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using LactafarmaAPI.Core;
using LactafarmaAPI.Core.Interfaces;
using LactafarmaAPI.Data.Entities;
using LactafarmaAPI.Data.Interfaces;
using LactafarmaAPI.Data.PagedData;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace LactafarmaAPI.Data.Repositories
{
    public class LogRepository : DataRepositoryBase<Log, LactafarmaContext>, ILogRepository
    {
        private readonly ILogger<LogRepository> _logger;

        public LogRepository(LactafarmaContext context, ILogger<LogRepository> logger, IHttpContextAccessor httpContext) : base(context, httpContext)
        {
            _logger = logger;
        }

        public async Task<IPagedList<Log>> GetLogs(LogPagedDataRequest request)
        {
            var query = EntityContext.Logs.AsQueryable();

            if (request.FromDate.HasValue)
                query = query.Where(x => x.Logged >= request.FromDate.Value);

            if (request.ToDate.HasValue)
                query = query.Where(x => x.Logged <= request.ToDate.Value);

            if (!string.IsNullOrWhiteSpace(request.Level))
                query = query.Where(x => x.Level == request.Level);

            if (!string.IsNullOrWhiteSpace(request.Message))
                query = query.Where(x => x.Message.Contains(request.Message));

            if (!string.IsNullOrWhiteSpace(request.Logger))
                query = query.Where(x => x.Logger.Contains(request.Logger));

            if (!string.IsNullOrWhiteSpace(request.Callsite))
                query = query.Where(x => x.Callsite.Contains(request.Callsite));

            if (!string.IsNullOrWhiteSpace(request.Exception))
                query = query.Where(x => x.Exception != null && x.Exception.Contains(request.Exception));

            string orderBy = request.SortField.ToString();
            if (QueryHelper.PropertyExists<Log>(orderBy))
                query = request.SortOrder == SortOrder.Ascending ? query.OrderByProperty(orderBy) : query.OrderByPropertyDescending(orderBy);
            else
                query = query.OrderByDescending(x => x.Logged);

            return await PagedList<Log>.CreateAsync(query, request.PageIndex, request.PageSize);
        }

        public async Task<IList<string>> GetLevels()
        {
            var query = EntityContext.Logs.AsQueryable()
                .Select(x => x.Level)
                .Distinct();

            return await query.ToListAsync();
        }

        protected override Expression<Func<Log, bool>> IdentifierPredicate(int id)
        {
            return e => e.Id == id;
        }
    }
}
