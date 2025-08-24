using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace LactafarmaAPI.Data.Entities
{
    public class ProductGroup
    {
        public int ProductId { get; set; }
        public int GroupId { get; set; }


        //Navigation Properties
        public Group Group { get; set; }
        public Product Product { get; set; }

    }
}
