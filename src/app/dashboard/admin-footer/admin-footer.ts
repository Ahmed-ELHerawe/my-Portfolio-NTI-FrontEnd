import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-admin-footer',
  styleUrl: './admin-footer.css',
  templateUrl: './admin-footer.html',
})
export class AdminFooter {
year = new Date().getFullYear();
}