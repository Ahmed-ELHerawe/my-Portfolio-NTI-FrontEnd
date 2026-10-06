import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PortfolioService } from '../../core/services/portfolio-service';
import { IExperience } from '../../core/modeules/experience';

@Component({
  imports: [],
  selector: 'app-experience',
  styleUrl: './experience.css',
  templateUrl: './experience.html',
})
export class Experience implements OnInit {
loaded = false;
items:IExperience[] = [];

colors = [
  {dot:'bg-blue-500', badge:'bg-blue-500/10 text-blue-600 dark:text-blue-400'},
  {dot:'bg-purple-500', badge:'bg-purple-500/10 text-purple-600 dark:text-purple-400'},
  {dot:'bg-pink-500', badge:'bg-pink-500/10 text-pink-600 dark:text-pink-400'},
]

constructor(private _portfolioService:PortfolioService,private _cdr:ChangeDetectorRef){}

ngOnInit(): void {
  this._portfolioService.getExperience().subscribe(data=>{
    this.items = data;
    this.loaded = true;
    this._cdr.detectChanges();
  })
}

color(index:number):{dot:string, badge:string}{
  return this.colors[index % this.colors.length];
}

period(item:IExperience):string{
  return item.startDate + ' - ' + (item.endDate || 'Present');
}
}