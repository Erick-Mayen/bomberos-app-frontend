import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UsersCardsComponent } from './Users-Cards/users-cards.component';
import { UserTableComponent } from './Users-Table/users-table.component';
import { AlertService } from '../../../services/alert.service';
import { filterData } from '../../../utils/filter.utils';
import { sortByColumn, SortDirection, toggleDirection } from '../../../utils/sort.util';
import { trackById } from '../../../utils/track.util';
import { UserComponent } from '../UserForm/users.component';
import { Rol, User, UserGraphQL } from '../../../interfaces';
import { UserService } from '../../../services/user.service';

type ViewMode = 'table' | 'cards';
type SortColumn = 'nombre_usuario' | 'rol' | 'personal_asignado' | 'fecha_ingreso' | 'activo';

@Component({
  selector: 'app-personal-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UserComponent,
    NgxPaginationModule,
    UsersCardsComponent,
    UserTableComponent,
    FontAwesomeModule
  ],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UserListComponent implements OnInit {

  page = 1;
  usersList: User[] = [];
  filteredUsers: User[] = [];
  showUserModal = false;
  searchForm: FormGroup;
  viewMode: ViewMode = 'table';
  sortColumn: SortColumn = 'fecha_ingreso';
  sortDirection: SortDirection = 'desc';
  roles: Rol[] = [];
  showEditModal = false;
  UserToEdit: UserGraphQL | null = null;


  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private alertService: AlertService
  ) {
    this.searchForm = this.formBuilder.group({
      searchTerm: [''],
      tipoFilter: ['todos']
    });
  }

  ngOnInit(): void {
    this.searchForm.valueChanges.subscribe(() => this.applyFilters());
    this.loadRoles();
    this.loadUsers();
  }

  private loadRoles(): void {
    this.userService.getAllRoles().subscribe({
      next: (data: Rol[]) => this.roles = data,
      error: err => console.error('Error al cargar roles disponibles', err)
    });
  }

  private loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data: UserGraphQL[]) => {
        this.usersList = data.map(user => ({
          id: user.id_usuario,
          nombre_usuario: user.nombre_usuario,
          rol: user.rol.nombre_rol,
          fecha_ingreso: new Date(user.fecha_creacion),
          activo: user.activo,
          personalAsignado: user.personalAsignado || null
        }));
        this.applyFilters();
      },
      error: err => console.error('Error al cargar usuarios', err)
    });
  }

  setViewMode(mode: ViewMode): void {
    this.viewMode = mode;
    this.page = 1;
    this.applyFilters();
  }

  sortBy(column: SortColumn): void {
    if (this.sortColumn === column) {
      this.sortDirection = toggleDirection(this.sortDirection);
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  openUserModal(): void { this.showUserModal = true; }
  closeUserModal(): void { this.showUserModal = false; }

  onUserCreated(userData: any): void {
    const rol = this.roles.find(t => t.id_rol === userData.id_rol)?.nombre_rol.toLowerCase() || '';
    const newUser: User = {
      ...userData,
      id: userData.id_usuario,
      fecha_ingreso: new Date(),
      activo: true,
      rol: rol,
      personalAsignado: userData.personalAsignado || null
    };
    this.usersList.unshift(newUser);
    this.applyFilters();
    this.loadUsers();
  }

  trackByUserId = trackById;

  private applyFilters(): void {
    const { searchTerm, tipoFilter } = this.searchForm.value;

    // Filtrado
    let data = filterData(this.usersList, searchTerm, [
      'nombre_usuario',
      'rol'
    ]);

    // Mostrar solo activos
    data = data.filter(u => u.activo);

    if (tipoFilter !== 'todos') {
      data = data.filter(u => u.rol.toLowerCase() === tipoFilter.toLowerCase());
    }


    // Ordenamiento
    data = sortByColumn(data, this.sortColumn, this.sortDirection);

    this.filteredUsers = data;
    this.adjustPageIfEmpty();
  }

  getRolLabel(tipo: string): string {
    return this.roles.find(r => r.nombre_rol.toLowerCase() === tipo.toLowerCase())?.nombre_rol ?? tipo;
  }

  editUser(user: User): void {
    this.userService.getUserById(user.id).subscribe({
      next: (userGraphQL: UserGraphQL) => {
        this.UserToEdit = userGraphQL;
        this.showEditModal = true;
      },
      error: err => console.error('Error al cargar usuario', err)
    });
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.UserToEdit = null;
  }

  onUserUpdated(): void {
    this.loadUsers();
    this.applyFilters();
    this.closeEditModal();
  }

  deleteUser(user: User): void {
    this.alertService.confirm(
      'Confirmar eliminación',
      `¿Está seguro de eliminar permanentemente a ${user.nombre_usuario}?`,
      () => {
        this.userService.deleteUser(Number(user.id)).subscribe({
          next: () => {
            this.usersList = this.usersList.filter(u => u.id !== user.id);
            this.applyFilters();
            this.alertService.SuccesNotify('Usuario eliminado exitosamente.');
          },
          error: () => {
            this.alertService.errorReport(
              'Error',
              'Ocurrió un error al eliminar el usuario. Intenta de nuevo.'
            );
          }
        });
      },
    );
  }

  private getCurrentItemsPerPage(): number {
    return this.viewMode === 'table' ? 10 : 6;
  }

  private adjustPageIfEmpty(): void {
    const itemsPerPage = this.getCurrentItemsPerPage();
    const totalItems = this.filteredUsers.length;
    const lastPage = Math.ceil(totalItems / itemsPerPage) || 1;

    if (this.page > lastPage) {
      this.page = lastPage;
    }
  }

  getUserName(u: User): string {
    return u.nombre_usuario;
  }

  getPersonalAsignado(u: User): string {
    return [u.personalAsignado?.primer_nombre, u.personalAsignado?.primer_apellido].filter(Boolean).join(' ');
  }

  getTotalUsersCount(): number {
    return this.usersList.filter(u => u.activo).length;
  }
}
