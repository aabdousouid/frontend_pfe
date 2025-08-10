import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const API = 'http://localhost:8080/api/notifications/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};



@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http:HttpClient) { }

  getUserNotification():Observable<any> {
    return this.http.get(API + 'geUserNotifications',httpOptions);
  }

  markAsRead(notificationId:number):Observable<any> {
    return this.http.put(API +`${notificationId}/read` , httpOptions);
  }

  markAllAsRead():Observable<any>{
    return this.http.put(API +'markAllAsRead',httpOptions);
  }
}
