import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Job } from '../models/job';
const API = 'http://localhost:8080/api/job/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};



@Injectable({
  providedIn: 'root'
})
export class JobsService {

  constructor(private http:HttpClient) { }



  getAllJobs() :Observable<any> {
    return this.http.get(API + 'getJobs', httpOptions);
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
  return this.http.post(`http://localhost:8080/api/application/apply/${jobId}/${userId}`, formData);
}



downloadCv(cvFileName: string) {
  const url = `http://localhost:8080/api/cv/cv/${cvFileName}`;
  window.open(url, '_blank');
}



}
