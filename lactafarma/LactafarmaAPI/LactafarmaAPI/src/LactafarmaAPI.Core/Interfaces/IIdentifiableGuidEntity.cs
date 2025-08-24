using System;
using System.Collections.Generic;
using System.Linq;

namespace LactafarmaAPI.Core.Interfaces
{
    public interface IIdentifiableGuidEntity
    {
        Guid EntityId { get; set; }
    }
}
