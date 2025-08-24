//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Linq.Expressions;
//using LactafarmaAPI.Core;
//using LactafarmaAPI.Data.Entities;
//using LactafarmaAPI.Data.Interfaces;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.Extensions.Logging;

//namespace LactafarmaAPI.Data.Repositories
//{
//    public class UsersRepository: IUserRepository
//    {
//        private readonly ILogger<UsersRepository> _logger;
//        public User CurrentUser { get; private set; }

//        #region Constructors

//        public UsersRepository(User user)
//        {
//            CurrentUser = user; 
//        }

//        #endregion

//        #region Public Methods

//        public void SetCurrentUser(User currentUser)
//        {
//            try
//            {
//                CurrentUser = currentUser;
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError($"Exception on SetCurrentUser with message: {ex.Message}");
//            }
//        }

//        #endregion
//    }
//}