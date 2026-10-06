import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IProfile } from '../modeules/profile';
import { IProject } from '../modeules/project';
import { ISkill } from '../modeules/skill';
import { IExperience } from '../modeules/experience';
import { IMessage } from '../modeules/message';
import { IStats } from '../modeules/stats';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
private _http = inject(HttpClient);
private _apiURL = 'http://localhost:3000/api';
fileURL = 'http://localhost:3000/files/';
private _unread = new BehaviorSubject<number>(0);
unread$ = this._unread.asObservable();

setUnread(count:number){
    this._unread.next(count);
}
getFileURL(fileName:string):string{
    return fileName ? this.fileURL + fileName : '';
}

getProfile():Observable<IProfile>{
    return this._http.get<IProfile>(this._apiURL + '/profile');
}

updateProfile(profileData:FormData):Observable<IProfile>{
    return this._http.put<IProfile>(this._apiURL + '/profile', profileData);
}

getProjects(category?:string):Observable<IProject[]>{
    let params = new HttpParams();
    if(category && category != 'all'){
        params = params.set('category', category);
    }
    return this._http.get<IProject[]>(this._apiURL + '/projects', { params });
}

addProject(projectData:FormData):Observable<IProject>{
    return this._http.post<IProject>(this._apiURL + '/projects', projectData);
}

updateProject(id:string, projectData:FormData):Observable<IProject>{
    return this._http.put<IProject>(this._apiURL + '/projects/' + id, projectData);
}

deleteProject(id:string):Observable<{message:string}>{
    return this._http.delete<{message:string}>(this._apiURL + '/projects/' + id);
}

getSkills():Observable<ISkill[]>{
    return this._http.get<ISkill[]>(this._apiURL + '/skills');
}

addSkill(skill:Omit<ISkill,'_id'>):Observable<ISkill>{
    return this._http.post<ISkill>(this._apiURL + '/skills', skill);
}

updateSkill(id:string, skill:Partial<Omit<ISkill,'_id'>>):Observable<ISkill>{
    return this._http.put<ISkill>(this._apiURL + '/skills/' + id, skill);
}

deleteSkill(id:string):Observable<{message:string}>{
    return this._http.delete<{message:string}>(this._apiURL + '/skills/' + id);
}

getExperience():Observable<IExperience[]>{
    return this._http.get<IExperience[]>(this._apiURL + '/experience');
}

addExperience(item:Omit<IExperience,'_id'>):Observable<IExperience>{
    return this._http.post<IExperience>(this._apiURL + '/experience', item);
}

updateExperience(id:string, item:Partial<Omit<IExperience,'_id'>>):Observable<IExperience>{
    return this._http.put<IExperience>(this._apiURL + '/experience/' + id, item);
}

deleteExperience(id:string):Observable<{message:string}>{
    return this._http.delete<{message:string}>(this._apiURL + '/experience/' + id);
}


sendMessage(message:Pick<IMessage,'name'|'email'|'subject'|'body'>):Observable<{message:string}>{
    return this._http.post<{message:string}>(this._apiURL + '/messages', message);
}

getMessages():Observable<IMessage[]>{
    return this._http.get<IMessage[]>(this._apiURL + '/messages');
}

markMessageRead(id:string, isRead:boolean = true):Observable<IMessage>{
    return this._http.patch<IMessage>(this._apiURL + '/messages/' + id + '/read', { isRead });
}

deleteMessage(id:string):Observable<{message:string}>{
    return this._http.delete<{message:string}>(this._apiURL + '/messages/' + id);
}

getStats():Observable<IStats>{
    return this._http.get<IStats>(this._apiURL + '/stats');
}
}