import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminHeader } from './admin-header/admin-header';
import { AdminSidebar } from './admin-sidebar/admin-sidebar';
import { AdminFooter } from './admin-footer/admin-footer';

@Component({
  imports: [RouterOutlet, AdminHeader, AdminSidebar, AdminFooter],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {
sidebarOpen = false;

toggleSidebar(){
  this.sidebarOpen = !this.sidebarOpen;
}

closeSidebar(){
  this.sidebarOpen = false;
}
}