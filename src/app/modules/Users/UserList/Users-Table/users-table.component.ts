import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { User } from '../../../../interfaces';

type SortColumn = 'nombre_usuario' | 'rol' | 'fecha_ingreso' | 'activo';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [NgxPaginationModule, CommonModule, FontAwesomeModule],
  templateUrl: './users-table.component.html',
  styleUrls: ['../users-list.component.scss']
})
export class UserTableComponent {
  @Input() usersList: User[] = [];
  @Input() page: number = 1;
  @Input() sortColumn: SortColumn | null = null;
  @Input() sortDirection: 'asc' | 'desc' | null = null;
  @Input() itemsPerPage: number = 10;
  @Input() getUserName!: (usuario: User) => string;
  @Output() edit = new EventEmitter<User>();
  @Output() delete = new EventEmitter<User>();
  @Output() sort = new EventEmitter<SortColumn>();

  trackByUserId(index: number, user: User): number{
    return user.id;
  }


}
