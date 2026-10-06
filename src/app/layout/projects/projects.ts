import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { ProjectCard } from '../../shared/project-card/project-card';
import { PortfolioService } from '../../core/services/portfolio-service';
import { IProject } from '../../core/modeules/project';

@Component({
  imports: [ProjectCard],
  selector: 'app-projects',
  styleUrl: './projects.css',
  templateUrl: './projects.html',
})
export class Projects implements OnInit {
loaded = false;
projects:IProject[] = [];
filtered:IProject[] = [];
filter = 'all';
selected?:IProject;

activeBtn = 'bg-blue-600 text-white shadow-lg';
inactiveBtn = 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700';

filters = [
  {key:'all', label:'All'},
  {key:'fullstack', label:'Full-Stack'},
  {key:'frontend', label:'Frontend'},
  {key:'ui', label:'UI/UX Design'},
]

constructor(private _portfolioService:PortfolioService,private _cdr:ChangeDetectorRef){}

ngOnInit(): void {
  this._portfolioService.getProjects().subscribe(data=>{
    this.projects = data;
    this.applyFilter();
    this.loaded = true;
    this._cdr.detectChanges();
  })
}

setFilter(key:string){
  this.filter = key;
  this.applyFilter();
}

private applyFilter(){
  this.filtered = this.filter == 'all' ? this.projects : this.projects.filter(p=>p.category == this.filter);
}

openModal(project:IProject){
  this.selected = project;
}

closeModal(){
  this.selected = undefined;
}

@HostListener('document:keydown.escape')
onEscape(){
  this.closeModal();
}
}