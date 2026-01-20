import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    // GIVEN: Ensure localStorage is empty before each test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store token and update login status when login is called', () => {
    // GIVEN: A mock token
    const mockToken = 'mock-jwt-token';

    // WHEN: Calling the login method
    service.login(mockToken);

    // THEN: Token should be in localStorage and isLoggedInSubject should be true
    expect(localStorage.getItem('token')).toBe(mockToken);
    service.isLoggedIn$.subscribe(status => {
      expect(status).toBe(true);
    });
  });

  it('should clear token and update status on clearToken', () => {
    // GIVEN: A token already stored in localStorage
    localStorage.setItem('token', 'some-token');
    service.updateLoginState(true);

    // WHEN: Calling clearToken
    service.clearToken();

    // THEN: Token should be removed and status should be false
    expect(localStorage.getItem('token')).toBeNull();
    service.isLoggedIn$.subscribe(status => {
      expect(status).toBe(false);
    });
  });

  it('should validate token via API', () => {
    // GIVEN: A mock token and response
    const token = 'valid-token';
    const mockResponse = { valid: true };

    // WHEN: Validating the token via API
    service.validateToken(token).subscribe(response => {
      // THEN: Response should be valid and state updated
      expect(response.valid).toBe(true);
    });

    const req = httpMock.expectOne('/auth/validate-token');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
});
