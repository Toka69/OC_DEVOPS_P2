import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // ADD THIS

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // GIVEN: Add HttpClientTestingModule to imports to satisfy service dependencies
      imports: [
        HomeComponent,
        HttpClientTestingModule
      ],
      providers: [
        provideRouter([]),
        provideNoopAnimations()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // THEN: The home component should be initialized
    expect(component).toBeTruthy();
  });
});
