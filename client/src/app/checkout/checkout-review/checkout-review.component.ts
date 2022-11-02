import { CdkStepper } from '@angular/cdk/stepper';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/models/basket';

@Component({
  selector: 'app-checkout-review',
  templateUrl: './checkout-review.component.html',
  styleUrls: ['./checkout-review.component.scss']
})
export class CheckoutReviewComponent implements OnInit {
  @Input() appStepper: CdkStepper = null!;
  basket$: Observable<IBasket | null> = new Observable();
  itemsLength: number = 0;

  constructor(private basketService: BasketService,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit(): void {
    this.basket$ = this.basketService.basket$;
  }
  
  createPaymentIntent() {
    return this.basketService.createPaymentIntent().subscribe({
      next: () => {
        this.appStepper.next()
        // this.toastr.success("Payment intent created");
      },
      error: (error) => {
        console.log(error);
        this.toastr.error(error.message);
      }
    })
  }

}
