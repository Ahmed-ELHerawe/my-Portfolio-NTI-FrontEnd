import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Footer } from '../shared/footer/footer';
import { Home } from './home/home';
import { About } from './about/about';
import { Skills } from './skills/skills';
import { Projects } from './projects/projects';
import { Experience } from './experience/experience';
import { Contact } from './contact/contact';
import { PortfolioService } from '../core/services/portfolio-service';
import { IProfile } from '../core/modeules/profile';
import { Header } from '../shared/header/header';

@Component({
  imports: [Header,Footer,Home,About,Skills,Projects,Experience,Contact],
  selector: 'app-layout',
  styleUrl: './layout.css',
  templateUrl: './layout.html',
})
export class Layout implements OnInit {
profile?:IProfile;

constructor(private _portfolioService:PortfolioService,private _cdr:ChangeDetectorRef){}

ngOnInit(): void {
  this._portfolioService.getProfile().subscribe(data=>{
    this.profile = data;
    this._cdr.detectChanges();
  })
}
}