import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const AUTH_API = 'http://localhost:8080/api/application/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor(private http:HttpClient) { }

  getAllApplications() {
     return this.http.get(AUTH_API + 'getApplications', httpOptions);
  }

   getUserApplications(userId: number) {
     return this.http.get(AUTH_API + `getUserApplications/${userId}`, httpOptions);
  }

  downloadCv(userId:number){
    return this.http.get('http://localhost:8080/api/profile/profiles/'+`${userId}/download-cv`,httpOptions);
  }

  delelteApplication(applicationId:number){
    return this.http.delete(AUTH_API +`deleteApplication/${applicationId}`,httpOptions);
  }

  findById(applicationId:number){
    return this.http.get(AUTH_API + `findById/${applicationId}`, httpOptions);
  }

  updateStatus(applicationId:number,status:string){
    return this.http.put(AUTH_API +`updateStatus/${applicationId}`,status,httpOptions)
  }

  addComments(applicationId:number,comment:string[]){
    return this.http.put(AUTH_API + `addComments/${applicationId}`, comment, httpOptions);
  }

  findByUserAndJob(userId:number,jobId:number){
    return this.http.get(AUTH_API + `findByUserAndJob/${userId}/${jobId}`, httpOptions);
  }


  findQuizByApplication(applicationId:number){
    return this.http.get(AUTH_API + `findByApplicationId/${applicationId}`,httpOptions);
  }
}
