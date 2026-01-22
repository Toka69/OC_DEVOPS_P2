import {Component, DestroyRef} from '@angular/core';
import {SidebarComponent} from "../sidebar/sidebar.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {StudentService} from '../../core/service/student.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Register} from '../../core/models/Register';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {NgClass, NgIf} from '@angular/common';
import {Student} from '../../core/models/Student';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {isScheduler} from 'rxjs/internal/util/isScheduler';

@Component({
  selector: 'app-student-edit',
  imports: [
    SidebarComponent,
    ReactiveFormsModule,
    NgIf,
    MatProgressSpinner
  ],
  templateUrl: './student-edit.component.html',
  styleUrl: './student-edit.component.css'
})
export class StudentEditComponent {
  editForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  studentId: number | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private studentService: StudentService,
    private router: Router,
    private route: ActivatedRoute,
    private destroyRef: DestroyRef,
  ) {}

  ngOnInit() {
    this.editForm = this.formBuilder.group(
      {
        firstName: [''],
        lastName: [''],
        login: [''],
        password: ['']
      },
    );

    this.loadStudent();
  }

  loadStudent(): void {
    this.isLoading = true;

    const idParam = this.route.snapshot.paramMap.get('id');
    this.studentId = idParam ? +idParam : null;

    if (this.studentId) {
      this.studentService.getStudent(this.studentId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(student => {
          this.editForm.patchValue({
            firstName: student.firstName,
            lastName: student.lastName,
            login: student.login,
            password: ''
          });

          this.isLoading = false;
        });
    }
  }

  get form() {
    return this.editForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = null;
    this.successMessage = null;

    const patchData: any = {};

    if (this.editForm.get('firstName')?.value) {
      patchData.firstName = this.editForm.get('firstName')?.value;
    }
    if (this.editForm.get('lastName')?.value) {
      patchData.lastName = this.editForm.get('lastName')?.value;
    }
    if (this.editForm.get('login')?.value) {
      patchData.login = this.editForm.get('login')?.value;
    }
    if (this.editForm.get('password')?.value) {
      patchData.password = this.editForm.get('password')?.value;
    }

    if (this.studentId) {
      this.studentService.patchStudent(this.studentId, patchData)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.router.navigate(['/students/list']);
          },
          error: (err: any) => {
            console.error('Update error', err);
          }
        });
    }
  }

  onReset() {
    this.submitted = false;
    this.router.navigate(['/students/list']);
  }
}
