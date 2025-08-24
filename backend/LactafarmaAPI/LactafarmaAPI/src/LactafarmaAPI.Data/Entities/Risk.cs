using LactafarmaAPI.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LactafarmaAPI.Data.Entities
{
    public class Risk : IIdentifiableEntity
    {
        public int Id { get; set; }
        public DateTime Modified { get; set; }

        //Navigation Properties
        public virtual ICollection<RiskMultilingual> RisksMultilingual { get; set; }
        public int EntityId
        {
            get { return Id; }
            set { Id = value; }
        }
    }
}
