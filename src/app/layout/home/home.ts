import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { PortfolioService } from '../../core/services/portfolio-service';
import { IProfile } from '../../core/modeules/profile';
import { ISkill } from '../../core/modeules/skill';

@Component({
  imports: [],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home implements OnInit, OnChanges, OnDestroy {
@Input() profile?:IProfile;

topSkills:ISkill[] = [];
frontendTop?:ISkill;
backendTop?:ISkill;
socials:{icon:string, url:string, label:string}[] = [];

typedText = '';
private _timer:any;
private _textIndex = 0;
private _charIndex = 0;
private _isDeleting = false;

constructor(private _portfolioService:PortfolioService,private _cdr:ChangeDetectorRef){}

ngOnInit(): void {
  this._portfolioService.getSkills().subscribe(data=>{
    this.topSkills = [...data].sort((a,b)=>b.level - a.level).slice(0,5);
    this.frontendTop = this.getTop(data,'frontend');
    this.backendTop = this.getTop(data,'backend');
    this._cdr.detectChanges();
  })
}

ngOnChanges(changes: SimpleChanges): void {
  if(changes['profile']){
    this.setSocials();
    this.startTyping();
  }
}

ngOnDestroy(): void {
  clearTimeout(this._timer);
}

private getTop(skills:ISkill[], category:string):ISkill | undefined{
  return skills.filter(s=>s.category == category).sort((a,b)=>b.level - a.level)[0];
}

private setSocials(){
  const p = this.profile;
  const all = [
    {icon:'fab fa-github', url:p?.github ?? '', label:'GitHub'},
    {icon:'fab fa-linkedin', url:p?.linkedIn ?? '', label:'LinkedIn'},
    {icon:'fab fa-twitter', url:p?.twitter ?? '', label:'Twitter'},
    {icon:'fab fa-codepen', url:p?.codepen ?? '', label:'CodePen'},
  ];
  this.socials = all.filter(s=>s.url);
}

private startTyping(){
  clearTimeout(this._timer);
  this._textIndex = 0;
  this._charIndex = 0;
  this._isDeleting = false;
  this.typedText = '';

  if(this.profile?.typingTexts?.length){
    this._timer = setTimeout(()=>this.type(), 0);
  }
}

private type(){
  const texts = this.profile?.typingTexts ?? [];
  if(!texts.length){
    return;
  }

  const current = texts[this._textIndex];
  this._charIndex += this._isDeleting ? -1 : 1;
  this.typedText = current.substring(0, this._charIndex);
  this._cdr.detectChanges();

  let speed = this._isDeleting ? 50 : 100;

  if(!this._isDeleting && this._charIndex == current.length){
    speed = 2000; 
    this._isDeleting = true;
  }
  else if(this._isDeleting && this._charIndex == 0){
    this._isDeleting = false;
    this._textIndex = (this._textIndex + 1) % texts.length;
    speed = 500;
  }

  this._timer = setTimeout(()=>this.type(), speed);
}
}