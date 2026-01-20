import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { UserService } from '../../core/service/user.service';
import { of } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent, HttpClientTestingModule],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        {
          provide: UserService,
          useValue: { register: () => of({}) }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should register successfully and show success message', () => {
    // GIVEN: Fill the form
    component.registerForm.setValue({
      firstName: 'Jane',
      lastName: 'Doe',
      login: 'jane',
      password: 'password'
    });

    // WHEN: Submitting
    component.onSubmit();

    // THEN: Success message should appear
    expect(component.successMessage).toBe('User registered successfully!');
    expect(component.isLoading).toBe(false);
  });
});
