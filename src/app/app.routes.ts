import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home.component';
import { homeRoutes } from './home/home.routes';
import { AuthGuard } from './auth/guards/auth.guard';
import { LoginGuard } from './auth/guards/login.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'app', component: HomeComponent, children: homeRoutes, canActivate: [AuthGuard]  },
  { path: '**', redirectTo: 'login' }
]
