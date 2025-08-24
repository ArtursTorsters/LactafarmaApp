using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace LactafarmaAPI.Data.Entities
{
    public class AliasMultilingual
    {
        public int AliasId { get; set; }
        public string Name { get; set; }
        public Guid LanguageId { get; set; }

        //Navigation Properties
        public Alias Alias { get; set; }
        public Language Language { get; set; }
    }
}