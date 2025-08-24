using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using LactafarmaAPI.Domain.Models;

namespace LactafarmaAPI.Controllers.Api.Interfaces
{
    interface IFavoritesController
    {
        IEnumerable<Favorite> GetFavoritesByUser();
        Favorite GetFavorite(int favoriteId);

    }
}
