import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { IProduct } from '../shared/models/product';
import { IBrand } from '../shared/models/productBrand';
import { IType } from '../shared/models/productType';
import { ShopParams } from '../shared/models/shopParams';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  @ViewChild('search', { static: true }) searchTerm: ElementRef | undefined;
  products: IProduct[] = [];
  brands: IBrand[] = [];
  types: IType[] = [];
  shopParams : ShopParams;
  totalCount = 0
  sortOptions = [
    {name: 'Alphabetical', value: 'name'},
    {name: 'Price Low to High', value: 'priceAsc'},
    {name: 'Price High to Low', value: 'priceDesc'},
  ];
  sideBarIsActive: boolean = false;
  sideBarIsActiveClass: string = "";

  constructor(private shopService: ShopService) {
    this.shopParams = shopService.getShopParams();
  }

  ngOnInit(): void {
    this.getProducts(true);
    this.getBrands();
    this.getTypes();
  }

  getProducts (useCache = false) {
    this.shopService.getProducts(useCache).subscribe({
      next: (response) => {
        this.products = response.data;
        this.totalCount = response.count;
      },
      error: (error) => {console.log(error);}
    })
  }

  getBrands() {
    this.shopService.getBrands().subscribe({
      next: (response) => {
        this.brands = [{id: 0, name: 'All'},...response];
      },
      error: (error) => {console.log(error);}
    })
  }
  getTypes() {
    this.shopService.getTypes().subscribe({
      next: (response) => {
        this.types = [{id: 0, name: 'All'},...response];
      },
      error: (error) => {console.log(error);}
    })
  }

  onBrandSelected(brandId: number){
    const params = this.shopService.getShopParams();
    params.brandId = brandId;
    params.pageNumber = 1;
    this.shopService.setShopParams(params);
    this.getProducts();
  }
  onTypeSelected(typeId: number){
    const params = this.shopService.getShopParams();
    params.typeId = typeId;
    params.pageNumber = 1;
    this.shopService.setShopParams(params);
    this.getProducts();
  }

  onSortSelected(){
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onPageChanged(event:PageChangedEvent) {
    // console.log(this.shopParams.pageNumber)
    const params = this.shopService.getShopParams();
    if(params.pageNumber !== event.page) {
      params.pageNumber = event.page
      this.shopService.setShopParams(params);
      this.getProducts(true);
    }

  }

  onSearch() {
    const params = this.shopService.getShopParams();
    (this.searchTerm?.nativeElement.value && this.searchTerm?.nativeElement.value.length !== 0)
    ? params.search = this.searchTerm?.nativeElement.value
    : params.search = undefined;
    params.pageNumber = 1;
    this.shopService.setShopParams(params);
    this.getProducts();
  }

  onReset() {
    this.searchTerm!.nativeElement.value = "";
    this.searchTerm = undefined;
    this.shopParams = new ShopParams();
    this.shopService.setShopParams(this.shopParams);
    this.getProducts();
  }

  showFilters(): void {
    (this.sideBarIsActiveClass == "active") 
      ? this.sideBarIsActiveClass = ""
      : this.sideBarIsActiveClass = "active"
  }

}
