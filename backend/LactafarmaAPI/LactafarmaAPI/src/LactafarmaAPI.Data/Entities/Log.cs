using System;
using LactafarmaAPI.Core.Interfaces;

namespace LactafarmaAPI.Data.Entities
{
    public class Log: IIdentifiableEntity
    {
        public int Id { get; set; }
        public string Application { get; set; }
        public DateTime Logged { get; set; }
        public string Level { get; set; }
        public string Action { get; set; }
        public string Controller { get; set; }
        public string Identity { get; set; }
        public string Referrer { get; set; }
        public string UserAgent { get; set; }
        public string Url { get; set; }
        public string Message { get; set; }
        public string Logger { get; set; }
        public string Callsite { get; set; }
        public string Exception { get; set; }
        public int EntityId
        {
            get => Id;
            set => Id = value;
        }
    }
}
