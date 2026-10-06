import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
showPassword = false;

myForm = new FormGroup({
  email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
  password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
})

private _inputBase = 'w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border focus:outline-hidden transition-colors';
private _inputOk = 'border-slate-200 dark:border-slate-800 focus:border-blue-500';
private _inputBad = 'border-red-500 focus:border-red-500';

constructor(private _router:Router){}

get email(){return this.myForm.get('email')}
get password(){return this.myForm.get('password')}

isInvalid(control:AbstractControl | null):boolean{
  return !!control && control.invalid && control.touched;
}

inputClass(control:AbstractControl | null, extra:string = ''):string{
  return this._inputBase + ' ' + (this.isInvalid(control) ? this._inputBad : this._inputOk) + ' ' + extra;
}

login(){
  if(this.myForm.invalid){
    this.myForm.markAllAsTouched();
    return;
  }
  this._router.navigate(['/dashboard']);
}
}