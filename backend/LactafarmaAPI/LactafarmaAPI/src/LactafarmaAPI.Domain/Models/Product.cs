using System;
using System.Collections.Generic;
using System.Text;
using LactafarmaAPI.Domain.Models.Base;

namespace LactafarmaAPI.Domain.Models
{
    public class Product : BaseModel
    {
        public string Description { get; set; }
        public DateTime Modified { get; set; }
        public Risk Risk { get; set; }        
    }
}
