import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket, IBasketItem } from '../../models/basket';

@Component({
  selector: 'app-basket-summary',
  templateUrl: './basket-summary.component.html',
  styleUrls: ['./basket-summary.component.scss']
})
export class BasketSummaryComponent implements OnInit {
  basket$: Observable<IBasket | null> = null!;
  // @Output() decrement: EventEmitter<IBasketItem | null> = new EventEmitter();  
  // @Output() increment: EventEmitter<IBasketItem | null> = new EventEmitter();  
  // @Output() remove: EventEmitter<IBasketItem | null> = new EventEmitter();  
  @Input() items: IBasketItem[] = [];

  constructor(private basketService: BasketService) { }

  ngOnInit(): void {
    this.basket$ = this.basketService.basket$;
  }

  onQuantityChange(item:IBasketItem, event : Event) {
    item.quantity = parseInt((event.target as HTMLInputElement).value)
    const basket = this.basketService.getCurrentBasketValue();
    if(!basket) {
      return
    }
    const index = basket.items.findIndex(i => i.id === item.id)
    if(index > -1) {
      basket.items[index].quantity = item.quantity;
      this.basketService.setBasket(basket)
    }
  }
  onRemoveItem(item:IBasketItem){
    let basket = this.basketService.getCurrentBasketValue();
    
    if(!basket){
      return;
    }
    basket.items = basket.items.filter(i => i.id !== item.id)
    if(basket.items.length > 0){
      this.basketService.setBasket(basket)
    } else {
      this.basketService.deleteBasket(basket);
    }
    
  }


}
