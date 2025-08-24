using LactafarmaAPI.Core.Interfaces;
using LactafarmaAPI.Data.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace LactafarmaAPI.Data.Interfaces
{
    public interface IFavoriteRepository : IDataRepository<Favorite>
    {
        IEnumerable<Favorite> GetFavoritesByUser(Guid userId);
        Favorite GetFavorite(int favoriteId);
    }
}
