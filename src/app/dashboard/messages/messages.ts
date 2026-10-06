import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PortfolioService } from '../../core/services/portfolio-service';
import { ToastService } from '../../core/services/toast-service';
import { IMessage } from '../../core/modeules/message';

@Component({
  imports: [DatePipe],
  selector: 'app-messages',
  styleUrl: './messages.css',
  templateUrl: './messages.html',
})
export class Messages implements OnInit {
loaded = false;
loadFailed = false;
messages:IMessage[] = [];
filter = 'all';
expandedId:string | null = null;
confirmId:string | null = null;

constructor(private _portfolioService:PortfolioService,private _toastService:ToastService,private _cdr:ChangeDetectorRef){}

ngOnInit(): void {
  this.loadMessages();
}

loadMessages(){
  this.loadFailed = false;
  this._portfolioService.getMessages().subscribe({
    next:data=>{
      this.messages = data;
      this.syncUnread();
      this.loaded = true;
      this._cdr.detectChanges();
    },
    error:()=>{
      this.loadFailed = true;
      this._cdr.detectChanges();
    }
  })
}

get unreadCount():number{
  return this.messages.filter(m=>!m.isRead).length;
}

get visible():IMessage[]{
  if(this.filter == 'unread'){
    return this.messages.filter(m=>!m.isRead || m._id == this.expandedId);
  }
  return this.messages;
}

private syncUnread(){
  this._portfolioService.setUnread(this.unreadCount);
}

setFilter(filter:string){
  this.filter = filter;
}

replyLink(message:IMessage):string{
  return 'mailto:' + message.email + '?subject=' + encodeURIComponent('Re: ' + message.subject);
}

toggle(message:IMessage){
  const opening = this.expandedId != message._id;
  this.expandedId = opening ? message._id : null;
  this.confirmId = null;
  if(opening && !message.isRead){
    this.setRead(message, true);
  }
}

setRead(message:IMessage, isRead:boolean){
  this._portfolioService.markMessageRead(message._id, isRead).subscribe({
    next:updated=>{
      this.messages = this.messages.map(m=>m._id == updated._id ? updated : m);
      this.syncUnread();
      this._cdr.detectChanges();
    },
    error:(err)=>{
      this._toastService.show(err.error?.message || 'Could not update the message.', 'error');
      this._cdr.detectChanges();
    }
  })
}

askDelete(id:string){
  this.confirmId = id;
}

cancelDelete(){
  this.confirmId = null;
}

confirmDelete(message:IMessage){
  this._portfolioService.deleteMessage(message._id).subscribe({
    next:()=>{
      this.messages = this.messages.filter(m=>m._id != message._id);
      this.expandedId = this.expandedId == message._id ? null : this.expandedId;
      this.confirmId = null;
      this.syncUnread();
      this._toastService.show('Message deleted');
      this._cdr.detectChanges();
    },
    error:(err)=>{
      this.confirmId = null;
      this._toastService.show(err.error?.message || 'Could not delete the message.', 'error');
      this._cdr.detectChanges();
    }
  })
}
}