import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PortfolioService } from '../../core/services/portfolio-service';
import { ToastService } from '../../core/services/toast-service';
import { IProject } from '../../core/modeules/project';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-manage-projects',
  styleUrl: './manage-projects.css',
  templateUrl: './manage-projects.html',
})
export class ManageProjects implements OnInit, OnDestroy {
loaded = false;
loadFailed = false;
saving = false;
showForm = false;
editingId:string | null = null;
confirmId:string | null = null;
projects:IProject[] = [];

// الصورة
imgURL = '';
imgPreview = '';
imgFile?:File;
imgError = '';

private _urlPattern = /^https?:\/\/\S+$/;

categories:Record<string, {label:string, tag:string}> = {
  fullstack: {label:'Full-Stack', tag:'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'},
  frontend: {label:'Frontend', tag:'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20'},
  ui: {label:'UI/UX Design', tag:'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20'},
}

myForm = new FormGroup({
  title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  category: new FormControl('fullstack', { nonNullable: true, validators: [Validators.required] }),
  techs: new FormControl('', { nonNullable: true }), // مفصولة بفاصلة
  desc: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  githubURL: new FormControl('', { nonNullable: true, validators: [Validators.pattern(this._urlPattern)] }),
  liveURL: new FormControl('', { nonNullable: true, validators: [Validators.pattern(this._urlPattern)] }),
})

// شكل الحقل: عادي أو فيه خطأ (الـ classes مكتوبة كاملة علشان Tailwind يشوفها)
private _inputBase = 'w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border focus:outline-hidden transition-colors';
private _inputOk = 'border-slate-200 dark:border-slate-800 focus:border-blue-500';
private _inputBad = 'border-red-500 focus:border-red-500';

constructor(private _portfolioService:PortfolioService,private _toastService:ToastService,private _cdr:ChangeDetectorRef){}

ngOnInit(): void {
  this.loadProjects();
}

ngOnDestroy(): void {
  this.clearPreview();
}

loadProjects(){
  this.loadFailed = false;
  this._portfolioService.getProjects().subscribe({
    next:data=>{
      this.projects = data;
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

categoryOf(key:string):{label:string, tag:string}{
  return this.categories[key] ?? { label:key, tag:'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20' };
}

imageOf(project:IProject):string{
  return this._portfolioService.getFileURL(project.imgURL);
}

get techsList():string[]{
  return this.parseTechs(this.myForm.getRawValue().techs);
}

private parseTechs(text:string):string[]{
  return text.split(',').map(t=>t.trim()).filter(t=>t);
}

openAdd(){
  this.editingId = null;
  this.myForm.reset({ title:'', category:'fullstack', techs:'', desc:'', githubURL:'', liveURL:'' });
  this.resetImage('');
  this.showForm = true;
  this.scrollToForm();
}

openEdit(project:IProject){
  this.editingId = project._id;
  this.myForm.reset({
    title:project.title,
    category:project.category,
    techs:(project.techs ?? []).join(', '),
    desc:project.desc,
    githubURL:project.githubURL ?? '',
    liveURL:project.liveURL ?? '',
  });
  this.resetImage(this.imageOf(project));
  this.showForm = true;
  this.scrollToForm();
}

closeForm(){
  this.showForm = false;
  this.editingId = null;
  this.resetImage('');
}

private resetImage(currentURL:string){
  this.clearPreview();
  this.imgFile = undefined;
  this.imgError = '';
  this.imgURL = currentURL;
}

private clearPreview(){
  if(this.imgPreview){
    URL.revokeObjectURL(this.imgPreview);
    this.imgPreview = '';
  }
}

private scrollToForm(){
  setTimeout(()=>document.getElementById('project-form')?.scrollIntoView({ behavior:'smooth', block:'start' }), 0);
}

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

save(){
  if(this.myForm.invalid){
    this.myForm.markAllAsTouched();
    return;
  }

  const value = this.myForm.getRawValue();
  const formData = new FormData();
  formData.append('title', value.title);
  formData.append('category', value.category);
  formData.append('desc', value.desc);
  formData.append('githubURL', value.githubURL);
  formData.append('liveURL', value.liveURL);
  formData.append('techs', JSON.stringify(this.parseTechs(value.techs)));
  if(this.imgFile){
    formData.append('img', this.imgFile);
  }

  const request = this.editingId
    ? this._portfolioService.updateProject(this.editingId, formData)
    : this._portfolioService.addProject(formData);

  this.saving = true;
  request.subscribe({
    next:project=>{
      if(this.editingId){
        this.projects = this.projects.map(p=>p._id == project._id ? project : p);
      }
      else{
        this.projects = [project, ...this.projects]; // الأحدث الأول زي الموقع
      }
      this._toastService.show(this.editingId ? 'Project updated successfully!' : 'Project added successfully!');
      this.saving = false;
      this.closeForm();
      this._cdr.detectChanges();
    },
    error:(err)=>{
      this._toastService.show(err.error?.message || 'Could not save the project, please try again.', 'error');
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

confirmDelete(project:IProject){
  this._portfolioService.deleteProject(project._id).subscribe({
    next:()=>{
      this.projects = this.projects.filter(p=>p._id != project._id);
      this.confirmId = null;
      this._toastService.show('Project deleted');
      this._cdr.detectChanges();
    },
    error:(err)=>{
      this.confirmId = null;
      this._toastService.show(err.error?.message || 'Could not delete the project.', 'error');
      this._cdr.detectChanges();
    }
  })
}
}