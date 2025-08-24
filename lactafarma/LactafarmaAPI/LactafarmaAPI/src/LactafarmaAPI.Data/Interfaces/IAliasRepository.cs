using LactafarmaAPI.Core.Interfaces;
using LactafarmaAPI.Data.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace LactafarmaAPI.Data.Interfaces
{
    public interface IAliasRepository : IDataRepository<Alias>
    {
        IEnumerable<AliasMultilingual> GetAllAliases();

        IEnumerable<AliasMultilingual> GetAliasesByProduct(int productId);
              
        AliasMultilingual GetAlias(int aliasId);

    }
}
