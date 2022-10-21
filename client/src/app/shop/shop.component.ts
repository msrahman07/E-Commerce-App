import { Component, OnInit } from '@angular/core';
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
  products: IProduct[] = [];
  brands: IBrand[] = [];
  types: IType[] = [];
  shopParams = new ShopParams();
  totalCount = 0
  sortOptions = [
    {name: 'Alphabetical', value: 'name'},
    {name: 'Price Low to High', value: 'priceAsc'},
    {name: 'Price High to Low', value: 'priceDesc'},
  ];
  sideBarIsActive: boolean = false;
  sideBarIsActiveClass: string = "";

  constructor(private shopService: ShopService) { }

  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getTypes();
  }

  getProducts () {
    this.shopService.getProducts(this.shopParams).subscribe({
      next: (response) => {
        this.products = response.data;
        this.shopParams.pageNumber = response.pageIndex;
        this.shopParams.pageSize = response.pageSize;
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
    this.shopParams.brandId = brandId;
    this.getProducts();
  }
  onTypeSelected(typeId: number){
    this.shopParams.typeId = typeId;
    this.getProducts();
  }

  onSortSelected(){
    this.getProducts();
  }

  onPageChanged(event:PageChangedEvent) {
    // console.log(this.shopParams.pageNumber)
    this.shopParams.pageNumber = event.page
    this.getProducts();
  }

  showFilters(): void {
    (this.sideBarIsActiveClass == "active") 
      ? this.sideBarIsActiveClass = ""
      : this.sideBarIsActiveClass = "active"
  }

}
