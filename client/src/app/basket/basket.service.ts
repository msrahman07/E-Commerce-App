import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, throttleTime } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Basket, IBasket, IBasketItem } from '../shared/models/basket';
import { IProduct } from '../shared/models/product';

@Injectable({
  providedIn: 'root'
})

export class BasketService {
  baseUrl = environment.apiUrl;
  private basketSource = new BehaviorSubject<IBasket | null>(null);
  basket$ = this.basketSource.asObservable();

  constructor(private http: HttpClient) { }

  getBasket(id: string) {
    return this.http.get<IBasket>(this.baseUrl + `basket?id=${id}`)
      .pipe(
        map((basket: IBasket) => {
          this.basketSource.next(basket);
        })
      );
  }

  setBasket(basket: IBasket) {
    return this.http.post<IBasket>(this.baseUrl + 'basket', basket)
      .subscribe({
        next: (response) => {
          this.basketSource.next(response);
          console.log(response);
        },
        error: (error) => console.log(error)
      })
  }

  getCurrentBasketValue() {
    return this.basketSource.value;
  }

  addItemToBasket(item: IProduct, quantity=1) {
    const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(item, quantity);
    const basket = this.getCurrentBasketValue() ?? this.createBasket();
    basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity);
    this.setBasket(basket);
  }
  addOrUpdateItem(items: IBasketItem[], itemToAdd: IBasketItem, quantity: number): IBasketItem[] {
    const index = items.findIndex(i => i.id === itemToAdd.id);
    if(index === -1){
      itemToAdd.quantity = quantity;
      items.push(itemToAdd)
    } else {
      items[index].quantity += quantity;
    }
    return items;
  }
  createBasket(): IBasket {
    const basket = new Basket();
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }
  mapProductItemToBasketItem(item: IProduct, quantity: number): IBasketItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      quantity,
      brand: item.productBrand,
      type: item.productType,
    }
  }
}
