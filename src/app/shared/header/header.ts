import { Component } from '@angular/core';
import { ThemeService } from '../../core/services/theme-service';

@Component({
  imports: [],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
menuOpen = false;

links = [
  {name:'Home', href:'#hero'},
  {name:'About', href:'#about'},
  {name:'Skills', href:'#skills'},
  {name:'Projects', href:'#projects'},
  {name:'Experience', href:'#experience'},
  {name:'Contact', href:'#contact'},
]

constructor(public themeService:ThemeService){}

toggleMenu(){
  this.menuOpen = !this.menuOpen;
}

closeMenu(){
  this.menuOpen = false;
}
}