import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { PortfolioService } from '../../core/services/portfolio-service';
import { ToastService } from '../../core/services/toast-service';
import { IExperience } from '../../core/modeules/experience';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-manage-experience',
  styleUrl: './manage-experience.css',
  templateUrl: './manage-experience.html',
})
export class ManageExperience implements OnInit {
loaded = false;
loadFailed = false;
saving = false;
showForm = false;
editingId:string | null = null;
confirmId:string | null = null;
items:IExperience[] = [];

// لون تاريخ كل خبرة بيتبدل زي الـ Timeline في الموقع (الـ classes مكتوبة كاملة علشان Tailwind يشوفها)
colors = [
  'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  'bg-pink-500/10 text-pink-600 dark:text-pink-400',
]

private _year = /^\d{4}$/;

// بيتأكد إن سنة النهاية مش قبل سنة البداية
private _dateRange = (group:AbstractControl):ValidationErrors | null => {
  const current = group.get('current')?.value;
  const start = group.get('startDate')?.value;
  const end = group.get('endDate')?.value;
  if(current || !this._year.test(start) || !this._year.test(end)){
    return null;
  }
  return Number(end) < Number(start) ? { dateRange: true } : null;
}

myForm = new FormGroup({
  role: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  company: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  startDate: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(this._year)] }),
  endDate: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(this._year)] }),
  current: new FormControl(false, { nonNullable: true }),
  desc: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
}, { validators: [this._dateRange] })

// شكل الحقل: عادي أو فيه خطأ (الـ classes مكتوبة كاملة علشان Tailwind يشوفها)
private _inputBase = 'w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border focus:outline-hidden transition-colors';
private _inputOk = 'border-slate-200 dark:border-slate-800 focus:border-blue-500';
private _inputBad = 'border-red-500 focus:border-red-500';

constructor(private _portfolioService:PortfolioService,private _toastService:ToastService,private _cdr:ChangeDetectorRef){
  // لما تختار "لسه شغال هناك" سنة النهاية بتتقفل وبتتحفظ Present
  this.myForm.controls.current.valueChanges.subscribe(isCurrent=>{
    if(isCurrent){
      this.myForm.controls.endDate.disable();
    }
    else{
      this.myForm.controls.endDate.enable();
    }
  })
}

ngOnInit(): void {
  this.loadItems();
}

loadItems(){
  this.loadFailed = false;
  this._portfolioService.getExperience().subscribe({
    next:data=>{
      this.items = data;
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

hasDateRangeError():boolean{
  return this.myForm.hasError('dateRange') && !!this.ctrl('endDate')?.touched;
}

inputClass(name:string, extra:string = ''):string{
  const bad = this.isInvalid(this.ctrl(name)) || (name == 'endDate' && this.hasDateRangeError());
  return this._inputBase + ' ' + (bad ? this._inputBad : this._inputOk) + ' ' + extra;
}

color(index:number):string{
  return this.colors[index % this.colors.length];
}

period(item:IExperience):string{
  return item.startDate + ' - ' + (item.endDate || 'Present');
}

// الأحدث الأول (نفس ترتيب الـ Backend والموقع)
private sortItems(list:IExperience[]):IExperience[]{
  return [...list].sort((a,b)=>b.startDate.localeCompare(a.startDate));
}

// ---------- الفورم ----------
openAdd(){
  this.editingId = null;
  this.myForm.reset({ role:'', company:'', startDate:'', endDate:'', current:false, desc:'' });
  this.showForm = true;
  this.scrollToForm();
}

openEdit(item:IExperience){
  const isCurrent = !item.endDate || item.endDate == 'Present';
  this.editingId = item._id;
  this.myForm.reset({
    role:item.role,
    company:item.company,
    startDate:item.startDate,
    endDate:isCurrent ? '' : item.endDate,
    current:isCurrent,
    desc:item.desc,
  });
  this.showForm = true;
  this.scrollToForm();
}

closeForm(){
  this.showForm = false;
  this.editingId = null;
}

private scrollToForm(){
  setTimeout(()=>document.getElementById('experience-form')?.scrollIntoView({ behavior:'smooth', block:'start' }), 0);
}

save(){
  if(this.myForm.invalid){
    this.myForm.markAllAsTouched();
    return;
  }

  const value = this.myForm.getRawValue();
  const body = {
    role: value.role,
    company: value.company,
    startDate: value.startDate,
    endDate: value.current ? 'Present' : value.endDate,
    desc: value.desc,
  };

  const request = this.editingId
    ? this._portfolioService.updateExperience(this.editingId, body)
    : this._portfolioService.addExperience(body);

  this.saving = true;
  request.subscribe({
    next:item=>{
      if(this.editingId){
        this.items = this.sortItems(this.items.map(i=>i._id == item._id ? item : i));
      }
      else{
        this.items = this.sortItems([...this.items, item]);
      }
      this._toastService.show(this.editingId ? 'Experience updated successfully!' : 'Experience added successfully!');
      this.saving = false;
      this.closeForm();
      this._cdr.detectChanges();
    },
    error:(err)=>{
      this._toastService.show(err.error?.message || 'Could not save the experience, please try again.', 'error');
      this.saving = false;
      this._cdr.detectChanges();
    }
  })
}

// ---------- الحذف (بخطوتين: أحذف؟ ← أيوه) ----------
askDelete(id:string){
  this.confirmId = id;
}

cancelDelete(){
  this.confirmId = null;
}

confirmDelete(item:IExperience){
  this._portfolioService.deleteExperience(item._id).subscribe({
    next:()=>{
      this.items = this.items.filter(i=>i._id != item._id);
      this.confirmId = null;
      this._toastService.show('Experience deleted');
      this._cdr.detectChanges();
    },
    error:(err)=>{
      this.confirmId = null;
      this._toastService.show(err.error?.message || 'Could not delete the experience.', 'error');
      this._cdr.detectChanges();
    }
  })
}
}