using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Threading.Tasks;
using LactafarmaAPI.Core.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace LactafarmaAPI.Core
{
    public abstract class DataRepositoryBase<TEntity, TContext> : IDataRepository<TEntity>
        where TEntity : class, IIdentifiableEntity, new()
        where TContext : DbContext
    {
        #region Private Properties

        private readonly DbSet<TEntity> _dbSet;
        private readonly IHttpContextAccessor _httpContext;

        #endregion

        #region Public Properties

        public Guid LanguageId => User.LanguageId();
        public ClaimsPrincipal User =>  _httpContext.HttpContext.User;

        public TContext EntityContext;

        #endregion

        #region Constructors

        protected DataRepositoryBase(TContext entityContext, IHttpContextAccessor httpContext)
        {
            EntityContext = entityContext;
            _httpContext = httpContext;
            _dbSet = EntityContext.Set<TEntity>();
        }

        #endregion

        #region Public Methods

        protected abstract Expression<Func<TEntity, bool>> IdentifierPredicate(int id);

        public virtual TEntity Add(TEntity entity)
        {
            var addedEntity = AddEntity(entity);
            EntityContext.SaveChanges();
            return addedEntity;
        }

        public virtual async Task<TEntity> AddAsync(TEntity entity)
        {
            var addedEntity = AddEntity(entity);
            await EntityContext.SaveChangesAsync();
            return addedEntity;
        }

        public virtual TEntity Update(TEntity entity)
        {
            EntityContext.Entry(entity)
                .State = EntityState.Modified;

            var existingEntity = UpdateEntity(entity);

            EntityContext.SaveChanges();
            return existingEntity;
        }

        public virtual async Task<TEntity> UpdateAsync(TEntity entity)
        {
            EntityContext.Entry(entity)
                .State = EntityState.Modified;

            var existingEntity = UpdateEntity(entity);

            await EntityContext.SaveChangesAsync();
            return existingEntity;
        }

        public virtual void Remove(TEntity entity)
        {
            _dbSet.Remove(entity);
            EntityContext.Entry(entity)
                .State = EntityState.Deleted;
            EntityContext.SaveChanges();
        }

        public virtual void Remove(int id)
        {
            var entity = GetEntity(id);
            EntityContext.Entry(entity)
                .State = EntityState.Deleted;
            EntityContext.SaveChanges();
        }

        public virtual IEnumerable<TEntity> FindAll()
        {
            return GetEntities().Where(e => e.EntityId != 0);
        }

        public virtual TEntity FindById(int id)
        {
            return GetEntity(id);
        }

        #endregion

        #region Private Methods

        private TEntity AddEntity(TEntity entity)
        {
            return _dbSet.Add(entity).Entity;
        }

        private IQueryable<TEntity> GetEntities()
        {
            return _dbSet;
        }

        private TEntity GetEntity(int id)
        {
            return _dbSet.Where(IdentifierPredicate(id)).FirstOrDefault();
        }

        private TEntity UpdateEntity(TEntity entity)
        {
            var q = _dbSet.Where(IdentifierPredicate(entity.EntityId));
            return q.FirstOrDefault();
        }

        #endregion
    }

    public abstract class DataGuidRepositoryBase<TEntity, TContext, TUser> : IDataGuidRepository<TEntity>
        where TEntity : class, IIdentifiableGuidEntity, new()
        where TContext : DbContext
        where TUser : class, new()

    {
        #region Private Properties

        private readonly DbSet<TEntity> _dbSet;

        #endregion

        #region Public Properties

        public TContext EntityContext;
        public TUser User;

        #endregion

        #region Constructors

        protected DataGuidRepositoryBase(TContext entityContext)
        {
            EntityContext = entityContext;
            _dbSet = EntityContext.Set<TEntity>();
        }

        #endregion

        #region Public Methods

        protected abstract Expression<Func<TEntity, bool>> IdentifierPredicate(Guid id);

        public virtual TEntity Add(TEntity entity)
        {
            var addedEntity = AddEntity(entity);
            EntityContext.SaveChanges();
            return addedEntity;
        }

        public virtual async Task<TEntity> AddAsync(TEntity entity)
        {
            var addedEntity = AddEntity(entity);
            await EntityContext.SaveChangesAsync();
            return addedEntity;
        }

        public virtual TEntity Update(TEntity entity)
        {
            EntityContext.Entry(entity)
                .State = EntityState.Modified;

            var existingEntity = UpdateEntity(entity);

            EntityContext.SaveChanges();
            return existingEntity;
        }

        public virtual async Task<TEntity> UpdateAsync(TEntity entity)
        {
            EntityContext.Entry(entity)
                .State = EntityState.Modified;

            var existingEntity = UpdateEntity(entity);

            await EntityContext.SaveChangesAsync();
            return existingEntity;
        }

        public virtual void Remove(TEntity entity)
        {
            _dbSet.Remove(entity);
            EntityContext.Entry(entity)
                .State = EntityState.Deleted;
            EntityContext.SaveChanges();
        }

        public virtual void Remove(Guid id)
        {
            var entity = GetEntity(id);
            EntityContext.Entry(entity)
                .State = EntityState.Deleted;
            EntityContext.SaveChanges();
        }

        public virtual IEnumerable<TEntity> FindAll()
        {
return GetEntities().Where(e => e.EntityId != Guid.Empty);        }

        public virtual TEntity FindById(Guid id)
        {
            return GetEntity(id);
        }

        #endregion

        #region Private Methods

        private TEntity AddEntity(TEntity entity)
        {
            return _dbSet.Add(entity).Entity;
        }

        private IQueryable<TEntity> GetEntities()
        {
            return _dbSet;
        }

        private TEntity GetEntity(Guid id)
        {
            return _dbSet.Where(IdentifierPredicate(id)).FirstOrDefault();
        }

        private TEntity UpdateEntity(TEntity entity)
        {
            var q = _dbSet.Where(IdentifierPredicate(entity.EntityId));
            return q.FirstOrDefault();
        }

        #endregion
    }
}
