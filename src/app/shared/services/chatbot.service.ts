import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private baseUrl = 'http://localhost:8080/api/cv';

  constructor(private http: HttpClient) {}

  uploadCV(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/upload-cv`, formData);
  }

  recommendJobs(cvJson: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/recommend`, {
      cvJson,
      
    });
  }
}
