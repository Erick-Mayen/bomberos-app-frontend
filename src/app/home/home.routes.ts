import { Routes } from '@angular/router';
import { DashboardComponent } from '../modules/dashboard/dashboard.component';
import { PersonalListComponent } from '../modules/Personal/ListarPersonal/personal-list.component';
import { UserListComponent } from '../modules/Users/UserList/users-list.component';
import { VehicleListComponent } from '../modules/vehicles/VehicleList/vehicles-list.component';
import { MaintenanceListComponent } from '../modules/Maintenances/MaintenanceList/maintenance-list.component';


export const homeRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'personal', component: PersonalListComponent },
  { path: 'usuarios', component: UserListComponent },
  { path: 'vehiculos', component: VehicleListComponent},
  { path: 'mantenimientos', component: MaintenanceListComponent},
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' }
];
