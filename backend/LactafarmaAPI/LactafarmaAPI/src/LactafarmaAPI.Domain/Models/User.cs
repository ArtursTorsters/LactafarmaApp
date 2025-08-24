using System;
using System.Collections.Generic;
using System.Text;
using LactafarmaAPI.Domain.Models.Base;

namespace LactafarmaAPI.Domain.Models
{
    public class User
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string TwitterInfo { get; set; }
        public string FacebookInfo { get; set; }
        public string GoogleInfo { get; set; }
        public string SecretKey { get; set; }
        public string AppId { get; set; }
        public Language Language { get; set; }

        //Navigation Properties
        public IEnumerable<Favorite> Favorites { get; set; }
    }
}
