using System;
using System.Collections.Generic;
using System.Text;
using LactafarmaAPI.Domain.Models.Base;

namespace LactafarmaAPI.Domain.Models
{
    public class Favorite
    {
        public int Id { get; set; }
        public string Name { get; set; }

        //Navigation Properties
        public Product Product { get; set; }
        public Guid UserId { get; set; }
    }
}
