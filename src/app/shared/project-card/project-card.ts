import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { IProject } from '../../core/modeules/project';
import { PortfolioService } from '../../core/services/portfolio-service';

@Component({
  imports: [],
  selector: 'app-project-card',
  styleUrl: './project-card.css',
  templateUrl: './project-card.html',
})
export class ProjectCard implements OnChanges {
@Input() project!:IProject;
@Output() view = new EventEmitter<IProject>();

imgURL = '';
imgFailed = false;

categories:Record<string, {label:string, tag:string}> = {
  fullstack: {label:'Full-Stack', tag:'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'},
  frontend: {label:'Frontend', tag:'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20'},
  ui: {label:'UI/UX Design', tag:'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20'},
}

constructor(private _portfolioService:PortfolioService){}

ngOnChanges(changes: SimpleChanges): void {
  if(changes['project']){
    this.imgURL = this._portfolioService.getFileURL(this.project.imgURL);
    this.imgFailed = false;
  }
}

get category():{label:string, tag:string}{
  return this.categories[this.project.category] ?? {
    label:this.project.category,
    tag:'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
  };
}

onImgError(){
  this.imgFailed = true;
}

open(){
  this.view.emit(this.project);
}
}