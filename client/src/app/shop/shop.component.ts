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
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }
  onTypeSelected(typeId: number){
    this.shopParams.typeId = typeId;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onSortSelected(){
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onPageChanged(event:PageChangedEvent) {
    // console.log(this.shopParams.pageNumber)
    if(this.shopParams.pageNumber !== event.page) {
      this.shopParams.pageNumber = event.page
      this.getProducts();
    }
  }

  onSearch() {
    (this.searchTerm?.nativeElement.value && this.searchTerm?.nativeElement.value.length !== 0)
    ? this.shopParams.search = this.searchTerm?.nativeElement.value
    : this.shopParams.search = undefined;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onReset() {
    this.searchTerm!.nativeElement.value = "";
    this.searchTerm = undefined;
    this.shopParams = new ShopParams();
    this.getProducts();
  }

  showFilters(): void {
    (this.sideBarIsActiveClass == "active") 
      ? this.sideBarIsActiveClass = ""
      : this.sideBarIsActiveClass = "active"
  }

}
