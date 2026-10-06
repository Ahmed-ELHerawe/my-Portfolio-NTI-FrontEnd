import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PortfolioService } from '../../core/services/portfolio-service';
import { ToastService } from '../../core/services/toast-service';
import { ISkill } from '../../core/modeules/skill';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-manage-skills',
  styleUrl: './manage-skills.css',
  templateUrl: './manage-skills.html',
})
export class ManageSkills implements OnInit {
loaded = false;
loadFailed = false;
saving = false;
showForm = false;
editingId:string | null = null;
confirmId:string | null = null;
skills:ISkill[] = [];

groups:{key:string, title:string, icon:string, iconBox:string, bar:string, percent:string, skills:ISkill[]}[] = [
  {key:'frontend', title:'Frontend Development', icon:'fas fa-code', iconBox:'bg-blue-500/10 text-blue-500 dark:text-blue-400', bar:'bg-blue-500', percent:'text-blue-500 dark:text-blue-400', skills:[]},
  {key:'backend', title:'Backend Development', icon:'fas fa-server', iconBox:'bg-purple-500/10 text-purple-500 dark:text-purple-400', bar:'bg-purple-500', percent:'text-purple-500 dark:text-purple-400', skills:[]},
  {key:'tools', title:'Tools & DevOps', icon:'fas fa-screwdriver-wrench', iconBox:'bg-pink-500/10 text-pink-500 dark:text-pink-400', bar:'bg-pink-500', percent:'text-pink-500 dark:text-pink-400', skills:[]},
]

iconSuggestions = [
  {label:'Angular', icon:'fab fa-angular'},
  {label:'React', icon:'fab fa-react'},
  {label:'Node.js', icon:'fab fa-node-js'},
  {label:'JavaScript', icon:'fab fa-js'},
  {label:'HTML5', icon:'fab fa-html5'},
  {label:'CSS3', icon:'fab fa-css3-alt'},
  {label:'Sass', icon:'fab fa-sass'},
  {label:'Bootstrap', icon:'fab fa-bootstrap'},
  {label:'Git', icon:'fab fa-git-alt'},
  {label:'GitHub', icon:'fab fa-github'},
  {label:'Docker', icon:'fab fa-docker'},
  {label:'Python', icon:'fab fa-python'},
  {label:'npm', icon:'fab fa-npm'},
  {label:'Database', icon:'fas fa-database'},
  {label:'Server', icon:'fas fa-server'},
  {label:'Code', icon:'fas fa-code'},
]

myForm = new FormGroup({
  name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  category: new FormControl('frontend', { nonNullable: true, validators: [Validators.required] }),
  level: new FormControl(80, { nonNullable: true, validators: [Validators.required, Validators.min(0), Validators.max(100)] }),
  icon: new FormControl('', { nonNullable: true, validators: [Validators.pattern(/^[a-z0-9 -]*$/i)] }),
})

// شكل الحقل: عادي أو فيه خطأ (الـ classes مكتوبة كاملة علشان Tailwind يشوفها)
private _inputBase = 'w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border focus:outline-hidden transition-colors';
private _inputOk = 'border-slate-200 dark:border-slate-800 focus:border-blue-500';
private _inputBad = 'border-red-500 focus:border-red-500';

constructor(private _portfolioService:PortfolioService,private _toastService:ToastService,private _cdr:ChangeDetectorRef){}

ngOnInit(): void {
  this.loadSkills();
}

loadSkills(){
  this.loadFailed = false;
  this._portfolioService.getSkills().subscribe({
    next:data=>{
      this.skills = data;
      this.refreshGroups();
      this.loaded = true;
      this._cdr.detectChanges();
    },
    error:()=>{
      this.loadFailed = true;
      this._cdr.detectChanges();
    }
  })
}

private refreshGroups(){
  this.groups.forEach(group=>{
    group.skills = this.skills.filter(skill=>skill.category == group.key);
  })
}

ctrl(name:string):AbstractControl | null{
  return this.myForm.get(name);
}

isInvalid(control:AbstractControl | null):boolean{
  return !!control && control.invalid && control.touched;
}

inputClass(name:string):string{
  return this._inputBase + ' ' + (this.isInvalid(this.ctrl(name)) ? this._inputBad : this._inputOk);
}

// ---------- الفورم ----------
openAdd(){
  this.editingId = null;
  this.myForm.reset({ name:'', category:'frontend', level:80, icon:'' });
  this.showForm = true;
  this.scrollToForm();
}

openEdit(skill:ISkill){
  this.editingId = skill._id;
  this.myForm.reset({ name:skill.name, category:skill.category, level:skill.level, icon:skill.icon ?? '' });
  this.showForm = true;
  this.scrollToForm();
}

closeForm(){
  this.showForm = false;
  this.editingId = null;
}

pickIcon(icon:string){
  this.myForm.patchValue({ icon });
}

private scrollToForm(){
  setTimeout(()=>document.getElementById('skill-form')?.scrollIntoView({ behavior:'smooth', block:'start' }), 0);
}

save(){
  if(this.myForm.invalid){
    this.myForm.markAllAsTouched();
    return;
  }

  const value = this.myForm.getRawValue();
  const request = this.editingId
    ? this._portfolioService.updateSkill(this.editingId, value)
    : this._portfolioService.addSkill(value);

  this.saving = true;
  request.subscribe({
    next:skill=>{
      if(this.editingId){
        this.skills = this.skills.map(s=>s._id == skill._id ? skill : s);
      }
      else{
        this.skills = [...this.skills, skill];
      }
      this.refreshGroups();
      this._toastService.show(this.editingId ? 'Skill updated successfully!' : 'Skill added successfully!');
      this.saving = false;
      this.closeForm();
      this._cdr.detectChanges();
    },
    error:(err)=>{
      this._toastService.show(err.error?.message || 'Could not save the skill, please try again.', 'error');
      this.saving = false;
      this._cdr.detectChanges();
    }
  })
}

askDelete(id:string){
  this.confirmId = id;
}

cancelDelete(){
  this.confirmId = null;
}

confirmDelete(skill:ISkill){
  this._portfolioService.deleteSkill(skill._id).subscribe({
    next:()=>{
      this.skills = this.skills.filter(s=>s._id != skill._id);
      this.refreshGroups();
      this.confirmId = null;
      this._toastService.show('Skill deleted');
      this._cdr.detectChanges();
    },
    error:(err)=>{
      this.confirmId = null;
      this._toastService.show(err.error?.message || 'Could not delete the skill.', 'error');
      this._cdr.detectChanges();
    }
  })
}
}