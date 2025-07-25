import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Interview } from '../models/interview';
import { Observable } from 'rxjs/internal/Observable';

const AUTH_API = 'http://localhost:8080/api/interview';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class InterviewService {

  constructor(private http:HttpClient) { }

  saveInterview(applicationId: number, interview: Interview): Observable<any> {
  return this.http.post(AUTH_API+`/${applicationId}/interviews`, interview,httpOptions);
}


getInterviewsByApplication(applicationId:number): Observable<Interview[]> {
  return this.http.get<Interview[]>(AUTH_API + `/getApplicationInterviews/${applicationId}`, httpOptions);
}

updateInterview(interviewId:number,interview:Interview):Observable<any>{
  return this.http.put(AUTH_API + `/updateInterview/${interviewId}`,interview,httpOptions);
}

deleteInterview(interviewId:number):Observable<any>{
  return this.http.delete(AUTH_API + `/deleteInterview/${interviewId}`,httpOptions);
}

updateInterviewStatus(interviewId:number, status:string):Observable<any>{
  return this.http.put(AUTH_API + `/updateInterviewStatus/${interviewId}`,status,httpOptions);
}

getApplicationByInterviewId(interviewId:number):Observable<any>{
  return this.http.get(AUTH_API + `/getApplicationByInterviewId/${interviewId}`,httpOptions);
}

}
