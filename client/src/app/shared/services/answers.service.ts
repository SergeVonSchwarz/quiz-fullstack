import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Answers} from "../interfaces";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AnswersService {
  
  constructor(private http: HttpClient) {
  }

  fetch(): Observable<Answers[]> {
      return this.http.get<Answers[]>('/api/answers')
  }

  getAnswersByUserId(id: string): Observable<Answers> {
    return this.http.get<Answers>(`/api/answers/${id}`)
  }

  create(): Observable<Answers> {
    return this.http.post<Answers>('/api/answers', {})
  }

  update(id: string, answer: number): Observable<Answers> {  
    return this.http.patch<Answers>(`/api/answers/${id}`, {answer})
  }
}
