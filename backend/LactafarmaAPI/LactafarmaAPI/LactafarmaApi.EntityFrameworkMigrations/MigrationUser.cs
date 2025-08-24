using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace LactafarmaApi.EntityFrameworkMigrations
{
    public class MigrationUser : IdentityUser
    {
        public Guid LanguageId { get; set; }
    }
}
