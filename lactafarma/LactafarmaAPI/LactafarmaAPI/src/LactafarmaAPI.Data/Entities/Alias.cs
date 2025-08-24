using LactafarmaAPI.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace LactafarmaAPI.Data.Entities
{
    public class Alias : IIdentifiableEntity
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public DateTime Modified { get; set; }

        //Navigation Properties
        public Product Product { get; set; }
        public virtual ICollection<AliasMultilingual> AliasMultilingual { get; set; }

        public int EntityId
        {
            get { return Id; }
            set { Id = value; }
        }

    }
}