import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';


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
const AUTH_API = 'http://localhost:8080/api/dashboardStats/';

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

}
