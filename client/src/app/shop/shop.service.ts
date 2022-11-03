import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IPagination, Pagination } from '../shared/models/pagination';
import { IProduct } from '../shared/models/product';
import { IBrand } from '../shared/models/productBrand';
import { IType } from '../shared/models/productType';
import { ShopParams } from '../shared/models/shopParams';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl = environment.apiUrl;
  products: IProduct[] = [];
  brands: IBrand[] = [];
  types: IType[] = [];
  pagination = new Pagination();
  shopParams = new ShopParams();
  productCache = new Map();

  constructor(private http: HttpClient) { }

  getProducts(useCache: boolean) {
    if(!useCache) {
      this.productCache = new Map();
    }
    if(useCache && this.productCache.size > 0) {
      if(this.productCache.has(Object.values(this.shopParams).join('-'))) {
        this.pagination.data = this.productCache.get(Object.values(this.shopParams).join('-'));
        return of(this.pagination);
      }
    }
    const {brandId, typeId, sort, pageNumber, pageSize, search } = this.shopParams;
    var params = new HttpParams();

    if(brandId !== 0){
      // console.log(brandId)
      params = params.append('brandId', brandId);
      console.log("brandId: ", brandId," and params here: ",params.getAll('brandId'))

    }

    if(typeId !== 0){
      params = params.append('typeId', typeId);
    }

    if(search !== undefined) {
      params = params.append('search', search);
    }

    params = params.append('sort', sort);
    params = params.append('pageIndex', pageNumber);
    params = params.append('pageSize', pageSize);

    return this.http.get<IPagination>(this.baseUrl + 'products', {observe: 'response', params})
      .pipe(
        map(response => {
          this.productCache.set(Object.values(this.shopParams).join('-'), response.body?.data);
          this.pagination = response.body!;
          return this.pagination;
        })
      );
  }

  setShopParams(params: ShopParams) {
    this.shopParams = params;
  }

  getShopParams() {
    return this.shopParams;
  }

  getProduct(id: number) {
    let product: IProduct | undefined;

    this.productCache.forEach((products: IProduct[]) => {
      product = products.find(p => p.id === id);
    })

    if(product){
      return of(product);
    }

    return this.http.get<IProduct>(this.baseUrl + 'products/'+ id);
  }

  getBrands() {
    if(this.brands.length > 0) {
      return of(this.brands)
    }
    return this.http.get<IBrand[]>(this.baseUrl + 'products/brands').pipe(
      map(response => {
        this.brands = response;
        return response;
      })
    );
  }
  getTypes() {
    if(this.types.length > 0) {
      return of(this.types)
    }
    return this.http.get<IType[]>(this.baseUrl + 'products/types').pipe(
      map(response => {
        this.types = response;
        return response;
      })
    );
  }
}
