import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';

import { HomeComponent } from './home/home.component';
import { homeRoutes } from './home/home.routes';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'app', component: HomeComponent, children: homeRoutes },
  { path: '**', redirectTo: 'login' }
]
