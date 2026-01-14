import { Routes } from '@angular/router';
import {RegisterComponent} from './pages/register/register.component';
import {AppComponent} from './app.component';
import {LoginComponent} from './pages/login/login.component';
import {StudentListComponent} from './pages/student-list/student-list.component';
import {AuthGuard} from './core/guards/auth.guard';
import {HomeComponent} from './pages/home/home.component';
import {StudentCreateComponent} from './pages/student-create/student-create.component';
import {StudentEditComponent} from './pages/student-edit/student-edit.component';
import {StudentDetailComponent} from './pages/student-detail/student-detail.component';
import {NotFoundComponent} from './pages/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  // {
  //   path: '**',
  //   redirectTo: '/login'
  // },
  {
    path: 'students/list',
    component: StudentListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'students/create',
    component: StudentCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'students/edit/:id',
    component: StudentEditComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'students/detail/:id',
    component: StudentDetailComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', component: NotFoundComponent },
];
