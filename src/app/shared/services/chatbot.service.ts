import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from './../../env/environment';

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private baseUrl = `${environment.apiBaseUrl}/api/chat-bot`;

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


/* applyToJobViaQuiz(jobId: number, userId: number, quizScore: number, matchScore: number, formData: FormData): Observable<any> {
  const url = `http://localhost:8080/api/chat-bot/apply-with-quiz/${jobId}/${userId}?quizScore=${quizScore}&matchingScore=${matchScore}`;
  return this.http.post(url, formData);
} */


async parseCvOfUser(userId: number): Promise<any> {
  return await firstValueFrom(
    this.http.post<any>(`${this.baseUrl}/parse-cv-of-user/${userId}`, {}, { withCredentials: true })
  );
}

}
