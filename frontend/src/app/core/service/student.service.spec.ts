import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StudentService } from './student.service';

describe('StudentService', () => {
  let service: StudentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StudentService]
    });
    service = TestBed.inject(StudentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve all students via GET', () => {
    // GIVEN: Mock list of students
    const mockStudents = [
      { id: 1, firstName: 'Alice', lastName: 'Wonder' },
      { id: 2, firstName: 'Bob', lastName: 'Builder' }
    ];

    // WHEN: Calling getStudents
    service.getStudents().subscribe(students => {
      // THEN: Returned data should match
      expect(students.length).toBe(2);
      expect(students).toEqual(mockStudents);
    });

    const req = httpMock.expectOne('/api/students');
    expect(req.request.method).toBe('GET');
    req.flush(mockStudents);
  });

  it('should create a new student via POST', () => {
    // GIVEN: A student object to create
    const studentData = { firstName: 'Charlie', lastName: 'Day', login: 'charlie', password: 'password' };

    // WHEN: Calling postCreateStudent
    service.postCreateStudent(studentData as any).subscribe(response => {
      // THEN: Response should be valid
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('/api/students');
    expect(req.request.method).toBe('POST');
    req.flush({ id: 3, ...studentData });
  });
});
