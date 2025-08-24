using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace LactafarmaAPI.Data.Entities
{
    public class GroupMultilingual
    {
        public int GroupId { get; set; }
        public Guid LanguageId { get; set; }
        public string Name { get; set; }

        //Navigation Properties
        public Group Group { get; set; }
        public Language Language{ get; set; }
    }
}
