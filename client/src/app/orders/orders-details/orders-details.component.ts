import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IOrder } from 'src/app/shared/models/order';
import { BreadcrumbService } from 'xng-breadcrumb';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-orders-details',
  templateUrl: './orders-details.component.html',
  styleUrls: ['./orders-details.component.scss']
})
export class OrdersDetailsComponent implements OnInit {
  id: string = '';
  order: IOrder = null!;

  constructor(private route: ActivatedRoute,
    private orderService: OrdersService,
    private bcService: BreadcrumbService,) {
      this.bcService.set('@orderDetails', ' ');
    }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    this.getSingleOrder();
  }

  getSingleOrder() {
    this.orderService.getSingleOrder(this.id).subscribe({
      next: (order) => {
        this.order = order
        this.bcService.set('@orderDetails', `Order #${order.id}`);
      },
      error: (error) => console.log(error)
    })
  }

}
