import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Vehicle, VehicleState } from '../../../../interfaces';
import { FormsModule } from '@angular/forms';

type SortColumn = 'unidad' | 'modelo' | 'tipo_vehiculo' | 'descripcion' | 'kilometraje' | 'Estado';;

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [NgxPaginationModule, CommonModule, FontAwesomeModule, FormsModule],
  templateUrl: './vehicles-table.component.html',
  styleUrls: ['../vehicles-list.component.scss']
})
export class VehicleTableComponent {
  @Input() vehiclesList: Vehicle[] = [];
  @Input() vehicleStates: VehicleState[] = [];
  @Output() changeState = new EventEmitter<{ vehicle: Vehicle, newState: number }>();
  @Input() page: number = 1;
  @Input() sortColumn: SortColumn | null = null;
  @Input() sortDirection: 'asc' | 'desc' | null = null;
  @Input() itemsPerPage: number = 10;
  @Input() getVehicleName!: (Vehicle: Vehicle) => string;
  @Output() edit = new EventEmitter<Vehicle>();
  @Output() delete = new EventEmitter<Vehicle>();
  @Output() sort = new EventEmitter<SortColumn>();

  trackByVehicleId(index: number, vehicle: Vehicle): number {
    return vehicle.id_unidad;
  }

  formatStateName(name: string): string {
  if (!name) return '';
  return name.toLowerCase().replace(/\s+/g, '-');
}
}
