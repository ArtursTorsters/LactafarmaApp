using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace LactafarmaAPI.Data.Entities
{
    public class ProductMultilingual
    {
        public int ProductId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public Guid LanguageId { get; set; }

        //Navigation Properties
        public Product Product { get; set; }
        public Language Language { get; set; }

    }
}
