using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class CustomerBasketDto
    {
        [Required]
        public string Id { get; set; } = null!;
        public List<BasketItemDto> Items { get; set; } = new List<BasketItemDto>();
        public int? DeliveryMethodId { get; set; }
        public string? PaymentIntentId { get; set; } = null!;        
        public string? ClientSecret { get; set; } = null!;
        public decimal ShippingPrice { get; set; }       
    }
}