using System;
using System.Collections.Generic;
using System.Text;
using LactafarmaAPI.Domain.Models.Base;

namespace LactafarmaAPI.Domain.Models
{
    public class Risk
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime Modified { get; set; }
    }
}
