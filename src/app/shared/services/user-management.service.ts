import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../env/environment';

const API = `${environment.apiBaseUrl}/api/user/`

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  constructor(private http: HttpClient) {}


  getAllUsers(): Observable<any> {
    return this.http.get(API + 'getUsers', httpOptions);
  }
 
 /** generic: /{id}/active?value=true|false */
  setActive(id: number, value: boolean): Observable<any> {
    return this.http.patch<any>(`${API}${id}/active`, null, { params: { value } as any });
  }

  activate(id: number): Observable<any> {
    return this.http.patch<any>(`${API}/${id}/activate`, null);
  }

  deactivate(id: number): Observable<any> {
    return this.http.patch<any>(`${API}/${id}/deactivate`, null);
  }

}