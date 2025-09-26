import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { VehicleComponent } from '../../vehicles/VehicleForm/vehicles.component';
import { AlertService } from '../../../services/alert.service';
import { filterData } from '../../../utils/filter.utils';
import { sortByColumn, SortDirection, toggleDirection } from '../../../utils/sort.util';
import { trackById } from '../../../utils/track.util';
import { Vehicle, VehicleState, VehicleType } from '../../../interfaces';
import { VehicleTableComponent } from './Vehicles-Table/vehicles-table.component';
import { VehicleService } from '../../../services/vehicle.service';

type ViewMode = 'table' | 'cards';
type SortColumn = 'unidad' | 'modelo' | 'tipo_vehiculo' | 'descripcion' | 'kilometraje' | 'Estado';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    VehicleComponent,
    NgxPaginationModule,
    VehicleTableComponent,
    FontAwesomeModule
  ],
  templateUrl: './vehicles-list.component.html',
  styleUrls: ['./vehicles-list.component.scss']
})
export class VehicleListComponent implements OnInit {

  page = 1;
  vehiclesList: Vehicle[] = [];
  filteredVehicles: Vehicle[] = [];
  showVehicleModal = false;
  searchForm: FormGroup;
  viewMode: ViewMode = 'table';
  sortColumn: SortColumn = 'unidad';
  sortDirection: SortDirection = 'desc';
  vehicleTypes: VehicleType[] = [];
  vehicleStates: VehicleState[] = [];
  showEditModal = false;
  vehicleToEdit: Vehicle | null = null;


  constructor(
    private formBuilder: FormBuilder,
    private vehicleService: VehicleService,
    private alertService: AlertService
  ) {
    this.searchForm = this.formBuilder.group({
      searchTerm: [''],
      tipoFilter: ['todos']
    });
  }

  ngOnInit(): void {
    this.searchForm.valueChanges.subscribe(() => this.applyFilters());
    this.loadVehicleTypes();
    this.loadVehicleStates();
    this.loadVehicles();
  }

  private loadVehicleTypes(): void {
    this.vehicleService.getAllVehicleTypes().subscribe({
      next: (data: VehicleType[]) => this.vehicleTypes = data,
      error: err => console.error('Error al cargar tipos de vehiculo disponibles', err)
    });
  }

  private loadVehicleStates(): void {
    this.vehicleService.getAllVehicleStates().subscribe({
      next: (data: VehicleState[]) => this.vehicleStates = data,
      error: err => console.error('Error al cargar estados de vehículo disponibles', err)
    });
  }

  private loadVehicles(): void {
    this.vehicleService.getAllVehicles().subscribe({
      next: (vehicle: Vehicle[]) => {
        this.vehiclesList = vehicle;
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

  openVehicleModal(): void { this.showVehicleModal = true; }
  closeVehicleModal(): void { this.showVehicleModal = false; }

  onVehicleCreated(): void {
    this.loadVehicles();
    this.applyFilters();
  }

  trackByVehicleId = trackById;

  private applyFilters(): void {
    const { searchTerm, tipoFilter } = this.searchForm.value;

    // Filtrado
    let data = filterData(this.vehiclesList, searchTerm, [
      'unidad',
      'modelo',
      'descripcion'
    ]);

    // Mostrar solo activos
    data = data.filter(u => u.activo);

    if (tipoFilter !== 'todos') {
      data = data.filter(u => u.tipo_vehiculo.nombre.toLowerCase() === tipoFilter.toLowerCase());
    }


    // Ordenamiento
    data = sortByColumn(data, this.sortColumn, this.sortDirection);

    this.filteredVehicles = data;
    this.adjustPageIfEmpty();
  }

  editVehicle(vehicle: Vehicle): void {
    this.vehicleService.getVehicleById(vehicle.id_unidad).subscribe({
      next: (vehicleData: Vehicle) => {
        this.vehicleToEdit = vehicleData;
        this.showEditModal = true;
      },
      error: err => console.error('Error al cargar usuario', err)
    });
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.vehicleToEdit = null;
  }

  onVehicleUpdated(): void {
    this.loadVehicles();
    this.applyFilters();
    this.closeEditModal();
  }

  deleteVehicle(vehicle: Vehicle): void {
    this.alertService.confirm(
      'Confirmar eliminación',
      `¿Está seguro de eliminar permanentemente la unidad ${vehicle.unidad}?`,
      () => {
        this.vehicleService.deleteVehicle(vehicle.id_unidad).subscribe({
          next: () => {
            this.vehiclesList = this.vehiclesList.filter(v => v.id_unidad !== vehicle.id_unidad);
            this.applyFilters();
            this.alertService.SuccesNotify('Unidad eliminada exitosamente.');
          },
          error: () => {
            this.alertService.errorReport(
              'Error',
              'Ocurrió un error al eliminar la unidad. Intenta de nuevo.'
            );
          }
        });
      },
    );
  }

  updateVehicleState(event: { vehicle: Vehicle; newState: number }): void {
    const { vehicle, newState } = event;

    this.vehicleService.updateVehicle({
      id_unidad: vehicle.id_unidad,
      id_estado_unidad: Number(newState)
    }).subscribe({
      next: () => {
        this.loadVehicles();
      },
      error: (err) => {
        console.error('Error al actualizar estado de vehículo:', err);
      }
    });
  }

  private getCurrentItemsPerPage(): number {
    return this.viewMode === 'table' ? 10 : 6;
  }

  private adjustPageIfEmpty(): void {
    const itemsPerPage = this.getCurrentItemsPerPage();
    const totalItems = this.filteredVehicles.length;
    const lastPage = Math.ceil(totalItems / itemsPerPage) || 1;

    if (this.page > lastPage) {
      this.page = lastPage;
    }
  }

  getTotalVehiclesCount(): number {
    return this.vehiclesList.filter(u => u.activo).length;
  }
}
