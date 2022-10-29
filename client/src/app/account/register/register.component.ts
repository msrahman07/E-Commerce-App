import { Component, OnInit } from '@angular/core';
import { AsyncValidatorFn, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, of, switchMap, timer } from 'rxjs';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({
    displayName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.pattern('^\\w+[\\w-\\.]*\\@\\w+((-\\w+)|(\\w*))\\.[a-z]{2,3}$')],
            [this.validateEmailNotTaken()]),
    password: new FormControl('', Validators.required),
  });

  errors: string[] = [];

  constructor(private fb: FormBuilder, private accountService: AccountService,
    private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.accountService.register(this.registerForm!.value).subscribe({
      next: () => {this.router.navigateByUrl('/shop')},
      error: (error) => {
        console.log(error);
        this.errors = error;
      }
    })
  }

  validateEmailNotTaken(): AsyncValidatorFn {
    return (control) => {
      return timer(500).pipe(
        switchMap(() => {
          if(!control.value) {
            return of(null);
          }
          return this.accountService.checkEmailExists(control.value)
            .pipe(
              map(res => {
                return res ? {emailExists: true} : null;
              })
            )
        })
      )
    };
  }
}
