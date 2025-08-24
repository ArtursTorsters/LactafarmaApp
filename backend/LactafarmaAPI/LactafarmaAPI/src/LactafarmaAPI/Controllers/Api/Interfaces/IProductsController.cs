using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using LactafarmaAPI.Domain.Models;

namespace LactafarmaAPI.Controllers.Api.Interfaces
{
    interface IProductsController
    {
        IEnumerable<Product> GetProductsByName(string startsWith);
        IEnumerable<Product> GetProductsByGroup(int groupId);
        IEnumerable<Product> GetProductsByBrand(int brandId);
        Product GetProductByAlias(int aliasId);
        Product GetProduct(int productId);
    }
}
