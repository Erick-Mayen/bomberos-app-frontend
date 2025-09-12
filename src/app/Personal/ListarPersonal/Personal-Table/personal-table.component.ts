import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

interface Personal {
  id: string;
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  tipo_personal: string;
  fecha_ingreso: Date;
  activo: boolean;
}

type SortColumn = 'nombre' | 'tipo_personal' | 'fecha_ingreso' | 'activo';

@Component({
  selector: 'app-personal-table',
  standalone: true,
  imports: [NgxPaginationModule, CommonModule, FontAwesomeModule],
  templateUrl: './personal-table.component.html',
  styleUrls: ['../personal-list.component.scss']
})
export class PersonalTableComponent {
  @Input() personalList: Personal[] = [];
  @Input() page: number = 1;
  @Input() sortColumn: SortColumn | null = null;
  @Input() sortDirection: 'asc' | 'desc' | null = null;
  @Input() itemsPerPage: number = 10;
  @Output() edit = new EventEmitter<Personal>();
  @Output() toggle = new EventEmitter<Personal>();
  @Output() delete = new EventEmitter<Personal>();
  @Output() sort = new EventEmitter<SortColumn>();

  trackByPersonalId(index: number, personal: Personal): string {
    return personal.id;
  }

  getFullName(personal: Personal): string {
    const nombres = [personal.primer_nombre, personal.segundo_nombre].filter(Boolean).join(' ');
    const apellidos = [personal.primer_apellido, personal.segundo_apellido].filter(Boolean).join(' ');
    return `${nombres} ${apellidos}`;
  }
}
