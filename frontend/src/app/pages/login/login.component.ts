import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '../../shared/material.module';
import {UserService} from '../../core/service/user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Login} from '../../core/models/Login';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, MaterialModule],
  templateUrl: './login.component.html',
  standalone: true,
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private destroyRef: DestroyRef,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group(
      {
        login: ['', Validators.required],
        password: ['', Validators.required]
      },
    );
  }

  get form() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    if (this.loginForm.invalid) {
      this.isLoading = false;
      return;
    }

    this.userService.login(this.loginForm.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          this.successMessage = 'Connection successful! Redirecting...';
          this.isLoading = false;
          setTimeout(() => {
            this.router.navigate(['/students/list']);
          }, 1000);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Incorrect login or password';
          this.isLoading = false;
        }
      });
  }

  onReset(): void {
    this.submitted = false;
    this.loginForm.reset();
  }
}
