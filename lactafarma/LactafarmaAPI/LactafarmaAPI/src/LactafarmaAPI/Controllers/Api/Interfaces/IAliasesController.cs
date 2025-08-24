using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace LactafarmaAPI.Controllers.Api.Interfaces
{
    interface IAliasesController
    {
        IEnumerable<Domain.Models.Alias> GetAliasesByName(string startsWith);
        IEnumerable<Domain.Models.Alias> GetAliasesByProduct(int productId);
        Domain.Models.Alias GetAlias(int aliasId);

    }
}
