import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface IToast{
    message:string;
    type:'success' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
private _toast = new BehaviorSubject<IToast | null>(null);
toast$ = this._toast.asObservable();
private _timer:any;

show(message:string, type:'success' | 'error' = 'success', duration:number = 4000){
    clearTimeout(this._timer);
    this._toast.next({ message, type });
    this._timer = setTimeout(()=>this.hide(), duration);
}

hide(){
    clearTimeout(this._timer);
    this._toast.next(null);
}
}