import { Component, DestroyRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { UserService } from '../../core/service/user.service';
import { Register } from '../../core/models/Register';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {Router} from '@angular/router';
import {AuthService} from '../../core/service/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, MaterialModule],
  templateUrl: './register.component.html',
  standalone: true,
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoggedIn: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private destroyRef: DestroyRef,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;

      if (this.isLoggedIn) {
        this.router.navigate(['/students/list']);
      }
    });

    this.registerForm = this.formBuilder.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        login: ['', Validators.required],
        password: ['', Validators.required]
      },
    );
  }

  get form() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.isLoading = true;

    if (this.registerForm.invalid) {
      this.isLoading = false;
      return;
    }

    this.errorMessage = null;
    this.successMessage = null;

    const registerUser: Register = {
      firstName: this.registerForm.get('firstName')?.value,
      lastName: this.registerForm.get('lastName')?.value,
      login: this.registerForm.get('login')?.value,
      password: this.registerForm.get('password')?.value
    };

    this.userService.register(registerUser)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.successMessage = 'User registered successfully!';
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err.error?.message;
          this.isLoading = false;
        }
      }
    );
  }

  onReset(): void {
    this.submitted = false;
    this.registerForm.reset();
    this.router.navigate(['/']);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
