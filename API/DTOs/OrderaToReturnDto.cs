using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities.OrderAggregate;

namespace API.DTOs
{
    public class OrderaToReturnDto
    {
        public int Id {get; set;}
        public string BuyerEmail { get; set; } = null!;
        public DateTimeOffset OrderDate { get; set; }
        public Address ShipToAddress { get; set; } = null!;
        public string DeliveryMethod { get; set; } = null!;
        public decimal ShippingPrice { get; set; }
        public IReadOnlyList<OrderItemDto> OrderItems { get; set; } = null!;
        public decimal Subtotal { get; set; }
        public decimal Total { get; set; }
        public string Status { get; set; } = null!;
        
    }
}