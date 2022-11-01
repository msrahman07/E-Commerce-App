import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/account/account.service';
import { IAddress } from 'src/app/shared/models/address';

@Component({
  selector: 'app-checkout-address',
  templateUrl: './checkout-address.component.html',
  styleUrls: ['./checkout-address.component.scss']
})
export class CheckoutAddressComponent implements OnInit {
  @Input() checkoutForm: FormGroup = null!;

  constructor(private accountService: AccountService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }
  updateAddressForm() {
    let address:IAddress = this.checkoutForm.get('addressForm')?.value
    if(address){
      this.accountService.updateUserAddress(address).subscribe({
        next: () => {
          this.toastr.success('Address saved');
          // this.checkoutForm.get('addressForm')?.patchValue(add)
        },
        error: (error) => {
          this.toastr.error(error.message);
        }
      });
    }
  }

}
