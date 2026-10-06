import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-admin-sidebar',
  styleUrl: './admin-sidebar.css',
  templateUrl: './admin-sidebar.html',
})
export class AdminSidebar {
@Input() open = false;
@Output() closed = new EventEmitter<void>();

links = [
  {name:'Overview', icon:'fas fa-chart-pie', path:'/dashboard/overview'},
  {name:'Profile', icon:'fas fa-user', path:'/dashboard/manage-profile'},
  {name:'Projects', icon:'fas fa-folder-open', path:'/dashboard/manage-projects'},
  {name:'Skills', icon:'fas fa-code', path:'/dashboard/manage-skills'},
  {name:'Experience', icon:'fas fa-briefcase', path:'/dashboard/manage-experience'},
  {name:'Messages', icon:'fas fa-envelope', path:'/dashboard/messages'},
]
}