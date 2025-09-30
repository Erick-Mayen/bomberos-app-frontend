import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { VehicleMaintenance } from '../../../../interfaces';
import { FormsModule } from '@angular/forms';
import { KilometrajePipe } from '../../../../utils/kilometraje.pipe';

type SortColumn =
  | 'unidad'
  | 'modelo'
  | 'descripcion'
  | 'taller'
  | 'kilometraje'
  | 'fecha_mantenimiento'
  | 'proximo_mantenimiento';

@Component({
  selector: 'app-maintenance-table',
  standalone: true,
  imports: [NgxPaginationModule, CommonModule, FontAwesomeModule, FormsModule, KilometrajePipe],
  templateUrl: './maintenances-table.component.html',
  styleUrls: ['../../../../../shared/styles/modules-list.scss']
})
export class MaintenanceTableComponent {
  @Input() maintenanceList: VehicleMaintenance[] = [];
  @Input() page: number = 1;
  @Input() sortColumn: SortColumn | null = null;
  @Input() sortDirection: 'asc' | 'desc' | null = null;
  @Input() itemsPerPage: number = 10;

  @Output() edit = new EventEmitter<VehicleMaintenance>();
  @Output() viewDetail = new EventEmitter<VehicleMaintenance>();
  @Output() delete = new EventEmitter<VehicleMaintenance>();
  @Output() sort = new EventEmitter<SortColumn>();

  trackByMaintenanceId(index: number, maintenance: VehicleMaintenance): number {
    return maintenance.id_mantenimiento;
  }
}
