import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PortfolioService } from '../../core/services/portfolio-service';
import { ToastService } from '../../core/services/toast-service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-manage-profile',
  styleUrl: './manage-profile.css',
  templateUrl: './manage-profile.html',
})
export class ManageProfile implements OnInit, OnDestroy {
loaded = false;
loadFailed = false;
saving = false;

// الصورة والـ CV
imgURL = '';
cvURL = '';
imgPreview = '';
imgFile?:File;
cvFile?:File;
imgError = '';
cvError = '';

private _urlPattern = /^https?:\/\/\S+$/;

myForm = new FormGroup({
  name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  badgeText: new FormControl('', { nonNullable: true }),
  heroText: new FormControl('', { nonNullable: true }),
  typingTexts: new FormControl('', { nonNullable: true }), // كل جملة في سطر
  about: new FormControl('', { nonNullable: true }),
  projectsCompleted: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
  yearsExperience: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
  clientSatisfaction: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0), Validators.max(100)] }),
  email: new FormControl('', { nonNullable: true, validators: [Validators.email] }),
  phone: new FormControl('', { nonNullable: true }),
  location: new FormControl('', { nonNullable: true }),
  github: new FormControl('', { nonNullable: true, validators: [Validators.pattern(this._urlPattern)] }),
  linkedIn: new FormControl('', { nonNullable: true, validators: [Validators.pattern(this._urlPattern)] }),
  twitter: new FormControl('', { nonNullable: true, validators: [Validators.pattern(this._urlPattern)] }),
  codepen: new FormControl('', { nonNullable: true, validators: [Validators.pattern(this._urlPattern)] }),
})

// شكل الحقل: عادي أو فيه خطأ (الـ classes مكتوبة كاملة علشان Tailwind يشوفها)
private _inputBase = 'w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border focus:outline-hidden transition-colors';
private _inputOk = 'border-slate-200 dark:border-slate-800 focus:border-blue-500';
private _inputBad = 'border-red-500 focus:border-red-500';

constructor(private _portfolioService:PortfolioService,private _toastService:ToastService,private _cdr:ChangeDetectorRef){}

ngOnInit(): void {
  this.loadProfile();
}

ngOnDestroy(): void {
  this.clearPreview();
}

loadProfile(){
  this.loadFailed = false;
  this._portfolioService.getProfile().subscribe({
    next:profile=>{
      this.imgURL = this._portfolioService.getFileURL(profile.imgURL ?? '');
      this.cvURL = this._portfolioService.getFileURL(profile.cvURL ?? '');
      this.myForm.patchValue({ ...profile, typingTexts: (profile.typingTexts ?? []).join('\n') });
      this.loaded = true;
      this._cdr.detectChanges();
    },
    error:()=>{
      this.loadFailed = true;
      this._cdr.detectChanges();
    }
  })
}

ctrl(name:string):AbstractControl | null{
  return this.myForm.get(name);
}

isInvalid(control:AbstractControl | null):boolean{
  return !!control && control.invalid && control.touched;
}

inputClass(name:string, extra:string = ''):string{
  return this._inputBase + ' ' + (this.isInvalid(this.ctrl(name)) ? this._inputBad : this._inputOk) + ' ' + extra;
}

// ---------- الملفات ----------
onImgChange(event:Event){
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  this.imgError = '';
  if(!file){
    return;
  }
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)){
    this.imgError = 'Only jpg, png or webp images are allowed';
    input.value = '';
    return;
  }
  if(file.size > 5 * 1024 * 1024){
    this.imgError = 'Image must be 5MB or less';
    input.value = '';
    return;
  }
  this.clearPreview();
  this.imgFile = file;
  this.imgPreview = URL.createObjectURL(file);
}

onCvChange(event:Event){
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  this.cvError = '';
  if(!file){
    return;
  }
  if(file.type != 'application/pdf'){
    this.cvError = 'Only PDF files are allowed';
    input.value = '';
    return;
  }
  if(file.size > 5 * 1024 * 1024){
    this.cvError = 'CV must be 5MB or less';
    input.value = '';
    return;
  }
  this.cvFile = file;
}

private clearPreview(){
  if(this.imgPreview){
    URL.revokeObjectURL(this.imgPreview);
    this.imgPreview = '';
  }
}

// ---------- الحفظ ----------
save(){
  if(this.myForm.invalid){
    this.myForm.markAllAsTouched();
    this._toastService.show('Please fix the highlighted fields', 'error');
    return;
  }

  const value = this.myForm.getRawValue();
  const formData = new FormData();

  formData.append('name', value.name);
  formData.append('title', value.title);
  formData.append('badgeText', value.badgeText);
  formData.append('heroText', value.heroText);
  formData.append('about', value.about);
  formData.append('projectsCompleted', String(value.projectsCompleted));
  formData.append('yearsExperience', String(value.yearsExperience));
  formData.append('clientSatisfaction', String(value.clientSatisfaction));
  formData.append('email', value.email);
  formData.append('phone', value.phone);
  formData.append('location', value.location);
  formData.append('github', value.github);
  formData.append('linkedIn', value.linkedIn);
  formData.append('twitter', value.twitter);
  formData.append('codepen', value.codepen);

  // جمل الكتابة: كل سطر جملة (الـ Backend بيقبلها JSON)
  const typingTexts = value.typingTexts.split('\n').map(t=>t.trim()).filter(t=>t);
  formData.append('typingTexts', JSON.stringify(typingTexts));

  if(this.imgFile){
    formData.append('img', this.imgFile);
  }
  if(this.cvFile){
    formData.append('cv', this.cvFile);
  }

  this.saving = true;
  this._portfolioService.updateProfile(formData).subscribe({
    next:profile=>{
      this.imgURL = this._portfolioService.getFileURL(profile.imgURL);
      this.cvURL = this._portfolioService.getFileURL(profile.cvURL);
      this.imgFile = undefined;
      this.cvFile = undefined;
      this.clearPreview();
      this.myForm.markAsPristine();
      this._toastService.show('Profile saved successfully!');
      this.saving = false;
      this._cdr.detectChanges();
    },
    error:(err)=>{
      this._toastService.show(err.error?.message || 'Could not save the profile, please try again.', 'error');
      this.saving = false;
      this._cdr.detectChanges();
    }
  })
}
}