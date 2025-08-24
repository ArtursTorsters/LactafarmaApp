using LactafarmaAPI.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace LactafarmaAPI.Data.Entities
{
    public class Product : IIdentifiableEntity
    {
        public int Id { get; set; }
        public DateTime Modified { get; set; }
        public int RiskId { get; set; }

        //Navigation Properties
        public Risk Risk { get; set; }
        public virtual ICollection<Alert> Alerts { get; set; }
        public virtual ICollection<Alias> Aliases { get; set; }
        //public virtual ICollection<DrugAlternative> DrugAlternatives { get; set; }
        public virtual ICollection<ProductBrand> ProductBrands { get; set; }
        public virtual ICollection<ProductGroup> ProductGroups { get; set; }
        public virtual ICollection<ProductMultilingual> ProductsMultilingual { get; set; }
        public int EntityId
        {
            get { return Id; }
            set { Id = value; }
        }
    }
}
