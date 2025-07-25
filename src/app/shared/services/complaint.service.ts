import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const AUTH_API = 'http://localhost:8080/api/complaint/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class ComplaintService {

    constructor(private http:HttpClient) { }

  addComplaint(complaint:any){
    return this.http.post(AUTH_API +'addComplaints',complaint,httpOptions);

  }

  getAllComplaints() {
    return this.http.get(AUTH_API + 'getComplaints', httpOptions);
  }

  updateStatus(complaintId:number,status:string){
    return this.http.put(AUTH_API +`updateComplaintStatus/${complaintId}`,status,httpOptions)
  }

   delelteComplaint(complaintId:number){
    return this.http.delete(AUTH_API +`deleteComplaint/${complaintId}`,httpOptions);
  }

  getComplaintsByUserId(userId:number){
      return this.http.get(AUTH_API +`getComplaintsByUser/${userId}`,httpOptions);
  }
}
