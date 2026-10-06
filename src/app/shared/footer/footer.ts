import { Component, Input } from '@angular/core';
import { IProfile } from '../../core/modeules/profile';

@Component({
  imports: [],
  selector: 'app-footer',
  styleUrl: './footer.css',
  templateUrl: './footer.html',
})
export class Footer {
@Input() profile?:IProfile;

year = new Date().getFullYear();
}