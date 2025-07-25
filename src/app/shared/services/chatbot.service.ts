import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private baseUrl = 'http://localhost:8080/api/chat-bot';

  constructor(private http: HttpClient) {}

  parseCV(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.baseUrl}/parse-cv`, formData);
  }

  matchJobs(parsedCV: any, jobs: any[]): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/match`, {
      parsed_cv: parsedCV,
      jobs: jobs
    });
  }

  startQuiz(job: any, candidateName: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/quiz/start`, {
      job,
      candidate_name: candidateName
    });
  }

  submitQuiz(answers: number[], candidateName: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/quiz/submit`, {
      answers,
      candidate_name: candidateName
    });
  }
}
