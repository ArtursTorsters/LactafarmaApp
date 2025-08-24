using LactafarmaAPI.Core.Interfaces;
using LactafarmaAPI.Data.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace LactafarmaAPI.Data.Interfaces
{
    public interface IGroupRepository : IDataRepository<Group>
    {
        IEnumerable<GroupMultilingual> GetAllGroups();
        IEnumerable<ProductGroup> GetGroupsByProduct(int productId);
        GroupMultilingual GetGroup(int groupId);
    }
}
