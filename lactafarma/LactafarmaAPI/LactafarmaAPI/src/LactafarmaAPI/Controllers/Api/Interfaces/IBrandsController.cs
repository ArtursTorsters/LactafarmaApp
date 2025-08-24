using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using LactafarmaAPI.Domain.Models;

namespace LactafarmaAPI.Controllers.Api.Interfaces
{
    interface IBrandsController
    {
        IEnumerable<Brand> GetBrandsByName(string startsWith);
        IEnumerable<Brand> GetBrandsByProduct(int productId);
        Brand GetBrand(int brandId);

    }
}
