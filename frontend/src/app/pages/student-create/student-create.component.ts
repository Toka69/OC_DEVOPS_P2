import {Component, DestroyRef} from '@angular/core';
import {SidebarComponent} from "../sidebar/sidebar.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Register} from '../../core/models/Register';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {StudentService} from '../../core/service/student.service';
import {NgClass, NgIf} from '@angular/common';
import {Router} from '@angular/router';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-student-create',
  imports: [
    SidebarComponent,
    ReactiveFormsModule,
    NgClass,
    NgIf,
    MatProgressSpinner
  ],
  templateUrl: './student-create.component.html',
  styleUrl: './student-create.component.css'
})
export class StudentCreateComponent {
  createForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private studentService: StudentService,
    private router: Router,
    private destroyRef: DestroyRef,
  ) {}

  ngOnInit() {
    this.createForm = this.formBuilder.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        login: ['', Validators.required],
        password: ['', Validators.required]
      },
    );
  }

  get form() {
    return this.createForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.isLoading = true;

    if (this.createForm.invalid) {
      this.isLoading = false;

      return;
    }

    this.errorMessage = null;
    this.successMessage = null;

    const registerUser: Register = {
      firstName: this.createForm.get('firstName')?.value,
      lastName: this.createForm.get('lastName')?.value,
      login: this.createForm.get('login')?.value,
      password: this.createForm.get('password')?.value
    };
    this.studentService.postCreateStudent(registerUser)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
          next: () => {
            this.isLoading = false;

            this.router.navigate(['/students/list']);
          },
          error: (err) => {
            this.errorMessage = err.error?.message;
            this.isLoading = false;
          }
        }
      );
  }

  onReset() {
    this.submitted = false;
    this.router.navigate(['/students/list']);
  }
}
