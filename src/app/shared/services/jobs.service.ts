import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Job } from '../models/job';
import { environment } from '../../env/environment';
const API = `${environment.apiBaseUrl}/api/job/`

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

export interface TopAppliedJob {
  title: string;
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | string; // adjust to your enum
  applications: number;
  matchingScore: number; // 0..100 already normalized by backend code
}

@Injectable({
  providedIn: 'root'
})
export class JobsService {

  constructor(private http:HttpClient) { }



  getAllJobs() :Observable<any> {
    return this.http.get(API + 'getJobs');
  }

  addJob(job: Job):Observable<any> {
   
    return this.http.post(API + 'addJob', job, httpOptions);
  }

  deleteJob(jobId:number):Observable<any>{
    return this.http.delete(API + `deleteJob/${jobId}`,httpOptions);
  }


  getJobById(jobId: number |null): Observable<Job> {
    return this.http.get<Job>(`${API}getJob/${jobId}`, httpOptions);
  }

  applyToJob(jobId: number, userId: number, formData: FormData): Observable<any> {
  return this.http.post(`${environment.apiBaseUrl}/api/application/apply/${jobId}/${userId}`, formData);
}

updateJob(Job: Job, jobId: number): Observable<any> {
  return this.http.put(API + `updateJob/${jobId}`, Job, httpOptions);
}



downloadCv(cvFileName: string) {
  const url = `${environment.apiBaseUrl}/api/cv/cv/${cvFileName}`;
  window.open(url, '_blank');
}

getTopAppliedJobs(limit = 5): Observable<any> {
    return this.http.get<any>(`${API}getTopAppliedJobs?limit=${limit}`);
  }


  // 👉 NEW: explicit active state endpoints
  enableJob(jobId: number): Observable<Job> {
    // matches PATCH /api/job/{id}/enable
    return this.http.patch<Job>(`${API}${jobId}/enable`, {}, httpOptions);
  }

  disableJob(jobId: number): Observable<Job> {
    // matches PATCH /api/job/{id}/disable
    return this.http.patch<Job>(`${API}${jobId}/disable`, {}, httpOptions);
  }

  // (Optional) generic setter, if you exposed /{id}/active?active=...
  setActive(jobId: number, active: boolean): Observable<Job> {
    return this.http.patch<Job>(`${API}${jobId}/active?active=${active}`, {}, httpOptions);
  }

}
