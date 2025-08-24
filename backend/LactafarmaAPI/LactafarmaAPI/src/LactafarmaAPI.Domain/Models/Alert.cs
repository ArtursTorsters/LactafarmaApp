using System;
using System.Collections.Generic;
using System.Text;
using LactafarmaAPI.Domain.Models.Base;

namespace LactafarmaAPI.Domain.Models
{
    public class Alert
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int ProductId { get; set; }
        public DateTime Created { get; set; }
        public string OldRisk { get; set; }
        public string NewRisk { get; set; }
    }
}
