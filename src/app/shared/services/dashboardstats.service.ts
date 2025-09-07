import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from './../../env/environment';

export interface DashboardStatsResponse {
  applications: number;
  newApplications: number;
  interviewsConducted: number;
  interviewsThisWeek: number;
  newJobPostings: number;
  jobPostingsToday: number;
  offerAcceptanceRate: number;
  // Add more fields if you add new KPIs in backend!
}
const AUTH_API = `${environment.apiBaseUrl}/api/dashboardStats/`;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DashboardstatsService {

  constructor(private http: HttpClient) {}

  getStats(): Observable<any> {
    return this.http.get(AUTH_API ,httpOptions);
  }
getUserStats(userId:number): Observable<any> {
    return this.http.get(AUTH_API + `user/${userId}` ,httpOptions);
  }


  activityChart():Observable<any>{
    return this.http.get(AUTH_API + 'activity-chart',httpOptions);
  }

}
