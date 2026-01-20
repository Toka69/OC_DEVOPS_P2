import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentEditComponent } from './student-edit.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {provideRouter, ActivatedRoute, Router} from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { StudentService } from '../../core/service/student.service';
import { AuthService } from '../../core/service/auth.service';
import { of } from 'rxjs';

describe('StudentEditComponent', () => {
  let component: StudentEditComponent;
  let fixture: ComponentFixture<StudentEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // GIVEN: The standalone component and HTTP testing module
      imports: [
        StudentEditComponent,
        HttpClientTestingModule
      ],
      providers: [
        provideNoopAnimations(),
        provideRouter([]),
        // GIVEN: Mocking ActivatedRoute to provide a fake student ID
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1'
              }
            }
          }
        },
        // GIVEN: Mocking StudentService to avoid real API calls and HttpClient errors
        {
          provide: StudentService,
          useValue: {
            getStudent: () => of({ id: 1, firstName: 'John', lastName: 'Doe', login: 'jdoe' }),
            patchStudent: () => of({})
          }
        },
        // GIVEN: Mocking AuthService (required because StudentEdit imports SidebarComponent)
        {
          provide: AuthService,
          useValue: {
            isLoggedIn$: of(true),
            checkInitialLoginState: jest.fn()
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load student data', () => {
    // THEN: The component should be initialized and the form populated
    expect(component).toBeTruthy();
    expect(component.editForm.get('firstName')?.value).toBe('John');
  });

  it('should navigate to list after successful update', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate');

    // GIVEN: Provide some data
    component.editForm.patchValue({ firstName: 'UpdatedName' });

    // WHEN: Submitting
    component.onSubmit();

    // THEN: Should redirect
    expect(navigateSpy).toHaveBeenCalledWith(['/students/list']);
  });
});
