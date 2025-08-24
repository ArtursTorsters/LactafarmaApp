using LactafarmaAPI.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LactafarmaAPI.Data.Entities
{
    public class Language : IIdentifiableGuidEntity
    {
        public Guid Id { get; set; }
        public string Name { get; set; }

        //Navigation Properties
        //public virtual ICollection<AlertMultilingual> AlertsMultilingual { get; set; }
        //public virtual ICollection<AliasMultilingual> AliasMultilingual { get; set; }
        //public virtual ICollection<BrandMultilingual> BrandsMultilingual { get; set; }
        //public virtual ICollection<DrugMultilingual> DrugsMultilingual { get; set; }
        //public virtual ICollection<GroupMultilingual> GroupsMultilingual { get; set; }

        public Guid EntityId
        {
            get => Id;
            set => Id = value;
        }

    }
}
