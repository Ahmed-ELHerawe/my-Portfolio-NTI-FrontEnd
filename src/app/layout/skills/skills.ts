import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PortfolioService } from '../../core/services/portfolio-service';
import { ISkill } from '../../core/modeules/skill';

@Component({
  imports: [],
  selector: 'app-skills',
  styleUrl: './skills.css',
  templateUrl: './skills.html',
})
export class Skills implements OnInit {
loaded = false;

groups:{key:string, title:string, icon:string, hover:string, iconBox:string, percent:string, bar:string, skills:ISkill[]}[] = [
  {
    key:'frontend', title:'Frontend Development', icon:'fas fa-code',
    hover:'hover:border-blue-500/50', iconBox:'bg-blue-500/10 text-blue-500 dark:text-blue-400',
    percent:'text-blue-500 dark:text-blue-400', bar:'bg-blue-500', skills:[]
  },
  {
    key:'backend', title:'Backend Development', icon:'fas fa-server',
    hover:'hover:border-purple-500/50', iconBox:'bg-purple-500/10 text-purple-500 dark:text-purple-400',
    percent:'text-purple-500 dark:text-purple-400', bar:'bg-purple-500', skills:[]
  },
  {
    key:'tools', title:'Tools & DevOps', icon:'fas fa-screwdriver-wrench',
    hover:'hover:border-pink-500/50', iconBox:'bg-pink-500/10 text-pink-500 dark:text-pink-400',
    percent:'text-pink-500 dark:text-pink-400', bar:'bg-pink-500', skills:[]
  },
]

constructor(private _portfolioService:PortfolioService,private _cdr:ChangeDetectorRef){}

ngOnInit(): void {
  this._portfolioService.getSkills().subscribe(data=>{
    this.groups.forEach(group=>{
      group.skills = data.filter(skill=>skill.category == group.key);
    })
    this.loaded = true;
    this._cdr.detectChanges();
  })
}

get hasSkills():boolean{
  return this.groups.some(group=>group.skills.length > 0);
}
}