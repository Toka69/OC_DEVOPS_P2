import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  constructor(private httpClient: HttpClient) {}

  private apiUrl = '/api/students';

  getStudents(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.apiUrl);
  }

  deleteStudent(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}
