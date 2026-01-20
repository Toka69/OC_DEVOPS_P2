import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {provideRouter, Router} from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { UserService } from '../../core/service/user.service';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let userService: UserService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, HttpClientTestingModule],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        {
          provide: UserService,
          useValue: { login: () => of({ token: 'fake-token' }) }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    fixture.detectChanges();
  });

  it('should create', () => {
    // THEN: Component is successfully initialized
    expect(component).toBeTruthy();
  });

  it('should mark form as invalid when empty', () => {
    // GIVEN: An empty form
    component.loginForm.setValue({ login: '', password: '' });
    // THEN: The form should be invalid
    expect(component.loginForm.invalid).toBeTruthy();
  });

  it('should mark form as invalid when empty', () => {
    component.loginForm.setValue({ login: '', password: '' });
    expect(component.loginForm.invalid).toBeTruthy();
  });

  it('should navigate to students list on successful login', () => {
    // GIVEN: A valid form and a successful login response
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.loginForm.setValue({ login: 'admin', password: 'password' });

    // WHEN: Submitting the form
    component.onSubmit();

    // THEN: Should navigate to the list
    expect(navigateSpy).toHaveBeenCalledWith(['/students/list']);
  });
});
