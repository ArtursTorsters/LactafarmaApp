using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using LactafarmaAPI.Core.Interfaces;
using LactafarmaAPI.Data.PagedData;
using LactafarmaAPI.Domain.Models;
using LactafarmaAPI.Domain.Models.Base;
using Log = LactafarmaAPI.Domain.Models.Log;
using User = LactafarmaAPI.Data.Entities.User;

namespace LactafarmaAPI.Services.Interfaces
{
    public interface ILactafarmaService
    {
        #region Public Methods

        IEnumerable<Alert> GetAlertsByProduct(int productId);
        IEnumerable<Alert> GetLastAlerts();
        Alert GetAlert(int alertId);
        //IEnumerable<BaseModel> GetAllAlerts();
        IEnumerable<BaseModel> GetAllAliases();
        IEnumerable<Alias> GetAliasesByProduct(int productId);
        IEnumerable<Brand> GetBrandsByProduct(int productId);
        IEnumerable<Group> GetGroupsByProduct(int productId);
        IEnumerable<BaseModel> GetAllBrands();
        IEnumerable<BaseModel> GetAllProducts();
        IEnumerable<Product> GetAlternativesByProduct(int productId);
        IEnumerable<Product> GetProductsByGroup(int groupId);
        IEnumerable<Product> GetProductsByBrand(int brandId);
        IEnumerable<Favorite> GetFavoritesByUser(Guid userId);
        IEnumerable<BaseModel> GetAllGroups();
        Group GetGroup(int groupId);
        //User GetUser(string userId);
        Alias GetAlias(int aliasId);
        Brand GetBrand(int brandId);
        Product GetProduct(int productId);
        Favorite GetFavorite(int favoriteId);
        Product GetProductByAlias(int aliasId);

        #endregion

        Task<IList<string>> GetLevelsAsync();

        Task<IPagedList<Log>> GetLogsAsync(LogPagedDataRequest request);
        //void SetUser(User currentUser);
    }
}