import { Component } from '@angular/core';
import {SidebarComponent} from '../sidebar/sidebar.component';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {StudentService} from '../../core/service/student.service';
import {NgIf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {Router} from '@angular/router';

@Component({
  selector: 'app-student-list',
  imports: [
    SidebarComponent,
    MatProgressSpinner,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatHeaderCellDef,
    MatCellDef,
    NgIf,
    MatHeaderRowDef,
    MatRowDef,
    MatIcon,
    MatIconButton
  ],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css'
})
export class StudentListComponent {
  students: any[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;
  displayedColumns: string[] = ['id', 'lastName', 'firstName', 'actions'];

  constructor(
    private studentService: StudentService,
    private router: Router,
  ) {}

  goToEdit(id: number) {
    this.router.navigate([`/students/edit/`, id]);
  }

  goToDetail(id: number) {
    this.router.navigate([`/students/detail/`, id]);
  }

  goToAdd(): void {
    this.router.navigate([`/students/create/`]);
  }

  deleteStudent(id: number) {
    if (confirm('Do you really want to delete this student?')) {
      this.isLoading = true;
      this.studentService.deleteStudent(id).subscribe({
        next: () => {
          this.loadStudents();
        },
        error: (err: any) => {
          this.errorMessage = "Error deleting the student";
          this.isLoading = false;
        }
      });
    }
  }

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.studentService.getStudents().subscribe({
      next: (data: any) => {
        this.students = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = 'Error retrieving students';
        this.isLoading = false;
        console.error('Erreur:', err);
      }
    });
  }
}
