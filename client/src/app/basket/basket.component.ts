import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IBasket, IBasketItem } from '../shared/models/basket';
import { BasketService } from './basket.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {
  basket$: Observable<IBasket | null> = new Observable;
  
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
