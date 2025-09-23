import { Routes } from '@angular/router';
import { DashboardComponent } from '../modules/dashboard/dashboard/dashboard.component';
import { PersonalListComponent } from '../modules/Personal/ListarPersonal/personal-list.component';
import { UserListComponent } from '../modules/Users/UserList/users-list.component';


export const homeRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'personal', component: PersonalListComponent },
  { path: 'usuarios', component: UserListComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' }
];
