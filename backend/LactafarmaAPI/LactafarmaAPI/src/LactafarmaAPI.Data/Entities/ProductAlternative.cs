using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace LactafarmaAPI.Data.Entities
{
    public class ProductAlternative
    {
        public int ProductId { get; set; }
        public int ProductAlternativeId { get; set; }

        //Navigation properties
        public Product ProductAlt { get; set; }
    }
}
