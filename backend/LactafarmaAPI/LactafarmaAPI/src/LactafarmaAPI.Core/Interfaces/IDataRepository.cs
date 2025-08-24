using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LactafarmaAPI.Core.Interfaces
{
    public interface IDataRepository
    {
    }

    public interface IDataRepository<T> : IDataRepository
        where T : class, IIdentifiableEntity, new()
    {
        T Add(T entity);
        Task<T> AddAsync(T entity);
        T Update(T entity);
        Task<T> UpdateAsync(T entity);
        void Remove(T entity);
        void Remove(int id);
        
        IEnumerable<T> FindAll();
        T FindById(int id);
    }

    public interface IDataGuidRepository<T> : IDataRepository
        where T : class, new()
    {
        T Add(T entity);
        Task<T> AddAsync(T entity);
        T Update(T entity);
        Task<T> UpdateAsync(T entity);
        void Remove(T entity);
        void Remove(Guid id);

        IEnumerable<T> FindAll();
        T FindById(Guid id);
    }
}
