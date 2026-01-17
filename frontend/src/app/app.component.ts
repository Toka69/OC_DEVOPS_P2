import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {SidebarComponent} from './pages/sidebar/sidebar.component';
import {NgIf} from '@angular/common';
import { Router } from '@angular/router';
import {AuthService} from './core/service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    RouterOutlet,
    SidebarComponent,
    NgIf
  ],
  styleUrl: './app.component.css'
})
export class AppComponent {
  isLoggedIn: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  title = 'etudiant-frontend';

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  logOut(): void {
    this.authService.clearToken();
    this.router.navigate(['/login']);
  }
}
