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

  startQuiz(parsedCV:any,job: any, candidateName: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/quiz/start`, {
      parsed_cv: parsedCV,
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

  saveQuizResult(data: {
  jobId: number;
  userId: number;
  quizScore: number;
  matchScore: number;
  status: string;
}) {
  return this.http.post(`${this.baseUrl}/quiz/save-result`, data);
}

applyToJobViaQuiz(jobId:number,userId:number,formData:FormData):Observable<any>{
  return this.http.post('http://localhost:8080/api/chat-bot/apply-with-quiz/' + jobId + '/' + userId, formData)
}
}
