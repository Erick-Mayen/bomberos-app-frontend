import { Routes } from '@angular/router';
import { DashboardComponent } from '../modules/dashboard/dashboard/dashboard.component';


export const homeRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: '**', redirectTo: 'dashboard' }
];
