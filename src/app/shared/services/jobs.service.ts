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


  getJobById(jobId: number |null): Observable<Job> {
    return this.http.get<Job>(`${API}getJob/${jobId}`, httpOptions);
  }


  applyToJob(jobId:number,user:any):Observable<any>{
    return this.http.post(`${API}apply/${jobId}`,httpOptions);
  }
}
