using LactafarmaAPI.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace LactafarmaAPI.Data.Entities
{
    public class User : IdentityUser
    {
        public Guid LanguageId { get; set; }
        
    }
}
