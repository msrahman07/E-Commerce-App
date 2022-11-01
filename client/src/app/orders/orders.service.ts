import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IOrder } from '../shared/models/order';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  baseUrl: string = environment.apiUrl;
  constructor(private http : HttpClient) { }

  getUserOrders() {
    return this.http.get<IOrder[]>(this.baseUrl + 'orders');
  }
  getSingleOrder(id: string) {
    return this.http.get<IOrder>(this.baseUrl + `orders/${id}`);
  }
}