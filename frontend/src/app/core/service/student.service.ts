import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {Student} from '../models/Student';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  constructor(private httpClient: HttpClient) {}

  private apiUrl = '/api/students';

  getStudents(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.apiUrl);
  }

  postCreateStudent(student: Student): Observable<Object> {
    return this.httpClient.post(this.apiUrl, student);
  }

  getStudent(id: number): Observable<Student> {
    return this.httpClient.get<Student>(`${this.apiUrl}/${id}`);
  }

  putStudent(id: number, form: object): Observable<Student> {
    return this.httpClient.put<Student>(`${this.apiUrl}/${id}`, form);
  }

  patchStudent(id: number, form: object): Observable<Student> {
    return this.httpClient.patch<Student>(`${this.apiUrl}/${id}`, form);
  }

  deleteStudent(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}
