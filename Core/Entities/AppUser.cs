using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace Core.Entities
{
    public class AppUser :IdentityUser
    {
        public string DisplayName { get; set; } = null!;
        public Address Address { get; set; } = null!;
        
    }
}