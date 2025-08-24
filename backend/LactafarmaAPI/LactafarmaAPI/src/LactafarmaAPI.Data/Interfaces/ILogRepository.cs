using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using LactafarmaAPI.Core.Interfaces;
using LactafarmaAPI.Data.Entities;
using LactafarmaAPI.Data.PagedData;

namespace LactafarmaAPI.Data.Interfaces
{
    public interface ILogRepository
    {
        Task<IPagedList<Log>> GetLogs(LogPagedDataRequest request);

        Task<IList<string>> GetLevels();
    }
}
