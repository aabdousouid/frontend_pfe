import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Interview } from '../models/interview';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from './../../env/environment';



const AUTH_API = `${environment.apiBaseUrl}/api/interview`;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


export interface UpcomingInterview {
  candidateName: string;
  jobTitle: string;
  scheduledDate: string; // ISO string
  status: string;
}

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

getUpcomingInterviews() {
    return this.http.get<UpcomingInterview[]>(AUTH_API+'/upcoming',httpOptions);
  }

  getUserUpcomingInterviews(userId: number) {
    return this.http.get<UpcomingInterview[]>(AUTH_API+`/user/${userId}/past-interviews`,httpOptions);
  }


  // 👉 NEW (preferred if you added PATCH endpoints)
  cancelInterview(interviewId: number, reason?: string): Observable<Interview> {
    const url = reason
      ? `${AUTH_API}/${interviewId}/cancel?reason=${encodeURIComponent(reason)}`
      : `${AUTH_API}/${interviewId}/cancel`;
    return this.http.patch<Interview>(url, {}, httpOptions);
  }

  // 👉 Optional generic setter (if you added /status endpoint)
  setStatus(
    interviewId: number,
    status: 'CONFIRMED' | 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED',
    reason?: string
  ): Observable<Interview> {
    const url = `${AUTH_API}/${interviewId}/status?status=${status}` + (reason ? `&reason=${encodeURIComponent(reason)}` : '');
    return this.http.patch<Interview>(url, {}, httpOptions);
  }

  // 👉 Fallback method if you DID NOT add PATCH endpoints (still works)
  cancelUsingPut(interviewId: number): Observable<any> {
    // Backend expects raw string body "CANCELLED"
    return this.updateInterviewStatus(interviewId, 'CANCELLED');
  }

}
