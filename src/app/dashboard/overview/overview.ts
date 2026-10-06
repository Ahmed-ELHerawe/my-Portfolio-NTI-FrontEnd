import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PortfolioService } from '../../core/services/portfolio-service';
import { IStats } from '../../core/modeules/stats';

@Component({
  imports: [RouterLink],
  selector: 'app-overview',
  styleUrl: './overview.css',
  templateUrl: './overview.html',
})
export class Overview implements OnInit {
stats?:IStats;

// كروت الإحصائيات (الـ classes مكتوبة كاملة علشان Tailwind يشوفها)
cards:{key:keyof IStats, label:string, icon:string, link:string, box:string}[] = [
  {key:'projects', label:'Projects', icon:'fas fa-folder-open', link:'/dashboard/manage-projects', box:'bg-blue-500/10 text-blue-500 dark:text-blue-400'},
  {key:'skills', label:'Skills', icon:'fas fa-code', link:'/dashboard/manage-skills', box:'bg-purple-500/10 text-purple-500 dark:text-purple-400'},
  {key:'experience', label:'Experience', icon:'fas fa-briefcase', link:'/dashboard/manage-experience', box:'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400'},
  {key:'messages', label:'Messages', icon:'fas fa-envelope', link:'/dashboard/messages', box:'bg-amber-500/10 text-amber-500 dark:text-amber-400'},
  {key:'unreadMessages', label:'Unread Messages', icon:'fas fa-envelope-open-text', link:'/dashboard/messages', box:'bg-pink-500/10 text-pink-500 dark:text-pink-400'},
]

constructor(private _portfolioService:PortfolioService,private _cdr:ChangeDetectorRef){}

ngOnInit(): void {
  this._portfolioService.getStats().subscribe(data=>{
    this.stats = data;
    this._cdr.detectChanges();
  })
}
}