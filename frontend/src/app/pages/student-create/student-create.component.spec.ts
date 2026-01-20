import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentCreateComponent } from './student-create.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {provideRouter, Router} from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { StudentService } from '../../core/service/student.service';
import { of } from 'rxjs';

describe('StudentCreateComponent', () => {
  let component: StudentCreateComponent;
  let fixture: ComponentFixture<StudentCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentCreateComponent, HttpClientTestingModule],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        {
          provide: StudentService,
          useValue: { postCreateStudent: () => of({}) }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to list after successful creation', () => {
    // GIVEN: A valid student form
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.createForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      login: 'jdoe',
      password: 'password'
    });

    // WHEN: Submitting the form
    component.onSubmit();

    // THEN: Navigation should occur
    expect(navigateSpy).toHaveBeenCalledWith(['/students/list']);
  });
});
