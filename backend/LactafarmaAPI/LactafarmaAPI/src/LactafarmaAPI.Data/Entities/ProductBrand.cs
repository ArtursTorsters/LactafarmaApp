using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace LactafarmaAPI.Data.Entities
{
    public class ProductBrand
    {
        public int ProductId { get; set; }
        public int BrandId { get; set; }


        //Navigation Properties
        public Brand Brand { get; set; }
        public Product Product { get; set; }

    }
}
