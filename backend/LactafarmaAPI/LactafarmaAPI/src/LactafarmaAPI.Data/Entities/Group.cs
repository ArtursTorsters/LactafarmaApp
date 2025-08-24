using LactafarmaAPI.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LactafarmaAPI.Data.Entities
{
    public class Group : IIdentifiableEntity
    {
        public int Id { get; set; }
        public DateTime Modified { get; set; }

        //Navigation Properties
        public virtual ICollection<ProductGroup> ProductGroups { get; set; }
        public virtual ICollection<GroupMultilingual> GroupsMultilingual { get; set; }

        public int EntityId
        {
            get { return Id; }
            set { Id = value; }
        }
    }
}
