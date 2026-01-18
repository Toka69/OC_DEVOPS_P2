import { Component } from '@angular/core';
import {SidebarComponent} from "../sidebar/sidebar.component";
import {StudentService} from '../../core/service/student.service';
import {ActivatedRoute} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {Student} from '../../core/models/Student';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-student-detail',
  imports: [
    SidebarComponent,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './student-detail.component.html',
  styleUrl: './student-detail.component.css'
})
export class StudentDetailComponent {
  studentId: number | null = null;
  student: Student | null = null;
  error: string | null = null;
  loading: boolean = false;

  constructor(
    private studentService: StudentService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.loadStudent();
  }

  loadStudent(): void {
    this.loading = true;
    const idParam = this.route.snapshot.paramMap.get('id');
    this.studentId = idParam ? +idParam : null;

    if (this.studentId) {
      this.studentService.getStudent(this.studentId).subscribe({
        next: (data: Student) => {
          this.student = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Unable to load student details.';
          this.loading = false;
          console.error(err);
        }
      });
    } else {
      this.error = 'Invalid student ID.';
      this.loading = false;
    }
  }
}
