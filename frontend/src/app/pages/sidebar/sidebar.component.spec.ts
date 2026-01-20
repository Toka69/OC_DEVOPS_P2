import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { AuthService } from '../../core/service/auth.service';
import { of } from 'rxjs';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        {
          provide: AuthService,
          useValue: {
            isLoggedIn$: of(true),
            logout: jest.fn()
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
