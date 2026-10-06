import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { PortfolioService } from '../../core/services/portfolio-service';
import { ThemeService } from '../../core/services/theme-service';

@Component({
  imports: [RouterLink],
  selector: 'app-admin-header',
  styleUrl: './admin-header.css',
  templateUrl: './admin-header.html',
})
export class AdminHeader implements OnInit, OnDestroy {
@Output() menuToggle = new EventEmitter<void>();

unread = 0;
private _routerSub?:Subscription;
private _unreadSub?:Subscription;

constructor(
  public themeService:ThemeService,
  private _portfolioService:PortfolioService,
  private _router:Router,
  private _cdr:ChangeDetectorRef
){}

ngOnInit(): void {
  this._unreadSub = this._portfolioService.unread$.subscribe(count=>{
    this.unread = count;
    this._cdr.markForCheck();
  });
  this.loadUnread();
  this._routerSub = this._router.events.pipe(filter(e=>e instanceof NavigationEnd)).subscribe(()=>this.loadUnread());
}

ngOnDestroy(): void {
  this._routerSub?.unsubscribe();
  this._unreadSub?.unsubscribe();
}

loadUnread(){
  this._portfolioService.getStats().subscribe({
    next:stats=>this._portfolioService.setUnread(stats.unreadMessages),
    error:()=>{}
  })
}

logout(){
  this._router.navigate(['/login']);
}
}