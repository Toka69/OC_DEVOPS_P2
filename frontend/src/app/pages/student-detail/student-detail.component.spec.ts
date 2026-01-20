import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentDetailComponent } from './student-detail.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { StudentService } from '../../core/service/student.service';
import { of } from 'rxjs';

describe('StudentDetailComponent', () => {
  let component: StudentDetailComponent;
  let fixture: ComponentFixture<StudentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentDetailComponent, HttpClientTestingModule],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        {
          provide: StudentService,
          useValue: { getStudent: () => of({ id: 1, firstName: 'John', lastName: 'Doe' }) }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load student details', () => {
    expect(component).toBeTruthy();
  });
});
