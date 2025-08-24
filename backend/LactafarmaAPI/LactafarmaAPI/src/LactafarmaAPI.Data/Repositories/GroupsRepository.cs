using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using LactafarmaAPI.Core;
using LactafarmaAPI.Data.Entities;
using LactafarmaAPI.Data.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace LactafarmaAPI.Data.Repositories
{
    public class GroupsRepository : DataRepositoryBase<Group, LactafarmaContext>, IGroupRepository
    {
        private readonly ILogger<GroupsRepository> _logger;

        #region Constructors

        public GroupsRepository(LactafarmaContext context, ILogger<GroupsRepository> logger, IHttpContextAccessor httpContext) : base(context, httpContext)
        {
            _logger = logger;
        }

        #endregion

        #region Public Methods

        public IEnumerable<GroupMultilingual> GetAllGroups()
        {
            try
            {
                return EntityContext.GroupsMultilingual.Where(l => l.LanguageId == LanguageId)
                    .Include(g => g.Group)
                    .AsEnumerable();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception on GetAllGroups with message: {ex.Message}");
                return null;
            }
        }

        public IEnumerable<ProductGroup> GetGroupsByProduct(int productId)
        {
            try
            {
                return EntityContext.ProductGroups.Where(pg => pg.ProductId == productId);
                //return EntityContext.GroupsMultilingual.Where(l => l.LanguageId == LanguageId).Include(a => a.Group)
                //    .ThenInclude(d => d.ProductGroups)
                //    .Where(a => a.Group.ProductGroups.FirstOrDefault().ProductId == productId).AsEnumerable();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception on GetGroupsByProduct with message: {ex.Message}");
                return null;
            }
        }

        public GroupMultilingual GetGroup(int groupId)
        {
            try
            {
                return EntityContext.GroupsMultilingual.Where(gm => gm.LanguageId == LanguageId).Include(g => g.Group)
                    .Single(g => g.GroupId == groupId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception on GetGroup with message: {ex.Message}");
                return null;
            }
        }

        #endregion

        #region Overridden Members

        protected override Expression<Func<Group, bool>> IdentifierPredicate(int id)
        {
            return e => e.Id == id;
        }

        #endregion
    }
}