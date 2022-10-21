import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { IPagination } from '../shared/models/pagination';
import { IBrand } from '../shared/models/productBrand';
import { IType } from '../shared/models/productType';
import { ShopParams } from '../shared/models/shopParams';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl = 'https://localhost:5001/api/'

  constructor(private http: HttpClient) { }

  getProducts({brandId, typeId, sort, pageNumber, pageSize } : ShopParams) {
    var params = new HttpParams();

    if(brandId !== 0){
      // console.log(brandId)
      params = params.append('brandId', brandId);
      console.log("brandId: ", brandId," and params here: ",params.getAll('brandId'))

    }

    if(typeId !== 0){
      params = params.append('typeId', typeId);
    }

    params = params.append('sort', sort);
    params = params.append('pageIndex', pageNumber);
    params = params.append('pageSize', pageSize);
    return this.http.get<IPagination>(this.baseUrl + 'products', {observe: 'body', params})

    // return this.http.get<IPagination>(this.baseUrl + 'products', {observe: 'response', params})
    //   .pipe(
    //     map(response => {
    //       return response.body!;
    //     })
    //   );
  }

  getBrands() {
    return this.http.get<IBrand[]>(this.baseUrl + 'products/brands');
  }
  getTypes() {
    return this.http.get<IType[]>(this.baseUrl + 'products/types');
  }
}
