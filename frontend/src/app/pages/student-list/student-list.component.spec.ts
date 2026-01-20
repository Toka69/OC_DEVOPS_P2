import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentListComponent } from './student-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { StudentService } from '../../core/service/student.service';
import { AuthService } from '../../core/service/auth.service';
import { of } from 'rxjs';

describe('StudentListComponent', () => {
  let component: StudentListComponent;
  let fixture: ComponentFixture<StudentListComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentListComponent, HttpClientTestingModule],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        {
          provide: StudentService,
          // GIVEN: Providing mock methods used in the component
          useValue: {
            getStudents: () => of([{ id: 1, firstName: 'Test', lastName: 'Student' }]),
            deleteStudent: (id: number) => of(undefined)
          }
        },
        {
          provide: AuthService,
          useValue: {
            isLoggedIn$: of(true),
            checkInitialLoginState: jest.fn()
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentListComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create and load students', () => {
    // THEN: Component is initialized and students list is populated
    expect(component).toBeTruthy();
    expect(component.students.length).toBe(1);
  });

  it('should navigate to edit page', () => {
    // GIVEN: A spy on the router navigation
    const navigateSpy = jest.spyOn(router, 'navigate');

    // WHEN: Calling goToEdit
    component.goToEdit(1);

    // THEN: Router should navigate to the correct path
    expect(navigateSpy).toHaveBeenCalledWith(['/students/edit/', 1]);
  });

  it('should navigate to add student page', () => {
    // GIVEN: A spy on the router navigation
    const navigateSpy = jest.spyOn(router, 'navigate');

    // WHEN: Calling goToAdd
    component.goToAdd();

    // THEN: Router should navigate to create path
    expect(navigateSpy).toHaveBeenCalledWith(['/students/create/']);
  });

  it('should call delete service when deleteStudent is confirmed', () => {
    // GIVEN: A spy on the student service delete method
    const studentService = TestBed.inject(StudentService);
    const deleteSpy = jest.spyOn(studentService, 'deleteStudent');

    // GIVEN: Mocking window.confirm to always return true
    jest.spyOn(window, 'confirm').mockReturnValue(true);

    // WHEN: Attempting to delete a student
    component.deleteStudent(1);

    // THEN: The service method should be called with the correct ID
    expect(deleteSpy).toHaveBeenCalledWith(1);
  });
});
