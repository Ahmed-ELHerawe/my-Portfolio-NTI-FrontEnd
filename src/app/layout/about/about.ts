import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IProfile } from '../../core/modeules/profile';
import { PortfolioService } from '../../core/services/portfolio-service';

@Component({
  imports: [],
  selector: 'app-about',
  styleUrl: './about.css',
  templateUrl: './about.html',
})
export class About implements OnChanges {
@Input() profile?:IProfile;

headline = '';
paragraphs:string[] = [];
imgURL = '';
cvURL = '';
imgFailed = false;

constructor(private _portfolioService:PortfolioService){}

ngOnChanges(changes: SimpleChanges): void {
  if(changes['profile']){

    const lines = (this.profile?.about ?? '').split(/\n+/).map(l=>l.trim()).filter(l=>l);
    this.headline = lines.length > 1 ? lines[0] : '';
    this.paragraphs = lines.length > 1 ? lines.slice(1) : lines;

    this.imgURL = this._portfolioService.getFileURL(this.profile?.imgURL ?? '');
    this.cvURL = this._portfolioService.getFileURL(this.profile?.cvURL ?? '');
    this.imgFailed = false;
  }
}

onImgError(){
  this.imgFailed = true;
}
}