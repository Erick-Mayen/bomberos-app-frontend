import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Personal } from '../../../../interfaces';

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
  @Input() getPersonalFullName!: (personal: Personal) => string;
  @Output() edit = new EventEmitter<Personal>();
  @Output() delete = new EventEmitter<Personal>();
  @Output() sort = new EventEmitter<SortColumn>();

  trackByPersonalId(index: number, personal: Personal): number{
    return personal.id;
  }


}
