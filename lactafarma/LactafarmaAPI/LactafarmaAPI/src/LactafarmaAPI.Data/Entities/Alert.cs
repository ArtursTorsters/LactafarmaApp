using LactafarmaAPI.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LactafarmaAPI.Data.Entities
{
    public class Alert: IIdentifiableEntity
    {
        public int Id { get; set; }
        public DateTime Created { get; set; }
        public int ProductId { get; set; }
        public int OldRiskId { get; set; }
        public int NewRiskId { get; set; }

        //Navigation Properties
        public Product Product { get; set; }
        public Risk OldRisk{ get; set; }
        public Risk NewRisk { get; set; }
        public int EntityId
        {
            get { return Id; }
            set { Id = value; }
        }
    }
}
