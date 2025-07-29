import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile } from '../models/user-profile';

//const API_URL = 'http://localhost:8080/api/test/';
const API = 'http://localhost:8080/api/profile/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  getUser(userId:number):Observable<any>{
    return this.http.get(API + `getUser/${userId}`,httpOptions);
  }

  getProfile(profileId:number):Observable<any>{
    return this.http.get(API + `getProfile/${profileId}`,httpOptions)
  }

  addProfile(profile:UserProfile):Observable<any>{
    return this.http.post(API + `addProfile`,profile,httpOptions);
  }


  updateProfile(profileId:number,profile:UserProfile):Observable<any>{
    return this.http.put(API + `updateProfile/${profileId}`,profile,httpOptions);
  }


   getProfileByUser(userId:number):Observable<any>{
    return this.http.get(API + `getProfileByUser/${userId}`,httpOptions)
  }

 
  addProfileWithCV(profile: UserProfile, cvFile: File): Observable<UserProfile> {
    const formData = new FormData();
    formData.append('profile', JSON.stringify(profile));
    if (cvFile) {
      formData.append('cv', cvFile);
    }
    
    return this.http.post<UserProfile>(`${API}add-with-cv`, formData);
  }

  
  updateProfileWithCV(profileId: number, profile: UserProfile, cvFile?: File): Observable<UserProfile> {
    const formData = new FormData();
    formData.append('profile', JSON.stringify(profile));
    if (cvFile) {
      formData.append('cv', cvFile);
    }
    
    return this.http.put<UserProfile>(`${API}${profileId}/update-with-cv`, formData);
  }

  downloadCV(profileId: number): Observable<Blob> {
      return this.http.get(`${API}${profileId}/download-cv`, {
        responseType: 'blob'
      });
    }

}
  /** tests
  getPublicContent(): Observable<any> {
    return this.http.get(API_URL + 'all', { responseType: 'text' });
  }

  getUserBoard(): Observable<any> {
    return this.http.get(API_URL + 'user', { responseType: 'text' });
  }
  
  getModeratorBoard(): Observable<any> {
    return this.http.get(API_URL + 'mod', { responseType: 'text' });
  }

  getAdminBoard(): Observable<any> {
    return this.http.get(API_URL + 'admin', { responseType: 'text' });
  }
  
   */

