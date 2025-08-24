using System;
using System.Collections.Generic;
using System.Text;

namespace LactafarmaAPI.Domain.Models.Base
{
    public class BaseModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string VirtualName { get; set; }
    }
}
