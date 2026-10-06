import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PortfolioService } from '../../core/services/portfolio-service';
import { ToastService } from '../../core/services/toast-service';
import { IProfile } from '../../core/modeules/profile';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-contact',
  styleUrl: './contact.css',
  templateUrl: './contact.html',
})
export class Contact implements OnChanges {
@Input() profile?:IProfile;

sending = false;
infoCards:{icon:string, label:string, value:string, href:string, box:string}[] = [];

myForm = new FormGroup({
  name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)] }),
  subject: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  body: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
})

private _inputBase = 'w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border focus:outline-hidden transition-colors';
private _inputOk = 'border-slate-200 dark:border-slate-800 focus:border-blue-500';
private _inputBad = 'border-red-500 focus:border-red-500';

constructor(private _portfolioService:PortfolioService,private _toastService:ToastService,private _cdr:ChangeDetectorRef){}

ngOnChanges(changes: SimpleChanges): void {
  if(changes['profile']){
    const p = this.profile;
    const all = [
      {icon:'fas fa-envelope', label:'Email Address', value:p?.email ?? '', href:'mailto:' + (p?.email ?? ''), box:'bg-blue-500/10 text-blue-500 dark:text-blue-400'},
      {icon:'fas fa-phone', label:'Phone / WhatsApp', value:p?.phone ?? '', href:'tel:' + (p?.phone ?? '').replace(/\s/g,''), box:'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400'},
      {icon:'fas fa-location-dot', label:'Location', value:p?.location ?? '', href:'', box:'bg-purple-500/10 text-purple-500 dark:text-purple-400'},
    ];
    this.infoCards = all.filter(card=>card.value);
  }
}

get name(){return this.myForm.get('name')}
get email(){return this.myForm.get('email')}
get subject(){return this.myForm.get('subject')}
get body(){return this.myForm.get('body')}

isInvalid(control:AbstractControl | null):boolean{
  return !!control && control.invalid && control.touched;
}

inputClass(control:AbstractControl | null, extra:string = ''):string{
  return this._inputBase + ' ' + (this.isInvalid(control) ? this._inputBad : this._inputOk) + ' ' + extra;
}

send(){
  if(this.myForm.invalid){
    this.myForm.markAllAsTouched();
    return;
  }

  this.sending = true;
  this._portfolioService.sendMessage(this.myForm.getRawValue()).subscribe({
    next:()=>{
      this._toastService.show('Your message has been sent successfully!');
      this.myForm.reset();
      this.sending = false;
      this._cdr.detectChanges();
    },
    error:(err)=>{
      this._toastService.show(err.error?.message || 'Something went wrong, please try again.', 'error');
      this.sending = false;
      this._cdr.detectChanges();
    }
  })
}
}