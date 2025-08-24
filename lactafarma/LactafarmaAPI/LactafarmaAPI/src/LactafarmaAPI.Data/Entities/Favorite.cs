using LactafarmaAPI.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace LactafarmaAPI.Data.Entities
{
    public class Favorite : IIdentifiableEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int ProductId { get; set; }
        public string UserId { get; set; }

        //Navigation Properties
        public Product Product { get; set; }

        public int EntityId
        {
            get => Id;
            set => Id = value;
        }
    }
}
