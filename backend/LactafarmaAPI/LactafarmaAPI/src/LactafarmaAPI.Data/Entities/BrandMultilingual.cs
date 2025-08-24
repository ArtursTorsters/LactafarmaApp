using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace LactafarmaAPI.Data.Entities
{
    public class BrandMultilingual
    {
        public int BrandId { get; set; }
        public string Name { get; set; }
        public Guid LanguageId { get; set; }


        //Navigation Properties
        public Brand Brand { get; set; }
        public Language Language { get; set; }

    }
}
