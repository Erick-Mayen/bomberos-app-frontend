import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AlertService } from '../../../services/alert.service';
import { filterData } from '../../../utils/filter.utils';
import { sortByColumn, SortDirection, toggleDirection } from '../../../utils/sort.util';
import { trackById } from '../../../utils/track.util';
import { Vehicle, VehicleMaintenance } from '../../../interfaces';
import { MaintenanceService } from '../../../services/maintenance.service';
import { VehicleService } from '../../../services/vehicle.service';
import { MaintenanceTableComponent } from './Maintenances-Table/maintenances-table.component';
import { MaintenanceComponent } from '../MaintenanceForm/maintenance.component';

type ViewMode = 'table';
type SortColumn = 'unidad' | 'modelo' | 'taller' | 'descripcion' | 'kilometraje' | 'fecha_mantenimiento' | 'proximo_mantenimiento';

@Component({
  selector: 'app-maintenance-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    FontAwesomeModule,
    MaintenanceTableComponent,
    MaintenanceComponent
  ],
  templateUrl: './maintenance-list.component.html',
  styleUrls: ['./maintenance-list.component.scss']
})
export class MaintenanceListComponent implements OnInit {

  page = 1;
  maintenanceList: VehicleMaintenance[] = [];
  filteredMaintenance: VehicleMaintenance[] = [];
  vehiclesList: Vehicle[] = [];
  showMaintenanceModal = false;
  searchForm: FormGroup;
  viewMode: ViewMode = 'table';
  sortColumn: SortColumn = 'fecha_mantenimiento';
  sortDirection: SortDirection = 'desc';
  showEditModal = false;
  maintenanceToEdit: VehicleMaintenance | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private vehicleService: VehicleService,
    private maintenanceService: MaintenanceService,
    private alertService: AlertService
  ) {
    this.searchForm = this.formBuilder.group({
      searchTerm: [''],
      unidadFilter: ['todas']
    });

    this.searchForm.valueChanges.subscribe(() => this.applyFilters());
  }

  ngOnInit(): void {
    this.searchForm.valueChanges.subscribe(() => this.applyFilters());
    this.loadMaintenances();
    this.loadVehicles();
  }

  private loadMaintenances(): void {
    this.maintenanceService.getAllVehicleMaintenance().subscribe({
      next: (data: VehicleMaintenance[]) => {
        this.maintenanceList = data.filter(m => m.activo);
        this.applyFilters();
      },
      error: err => console.error('Error al cargar mantenimientos', err)
    });
  }

  private loadVehicles(): void {
    this.vehicleService.getAllVehicles().subscribe({
      next: (vehicle: Vehicle[]) => {
        this.vehiclesList = vehicle.filter(v => v.activo);
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

  openMaintenanceModal(): void { this.showMaintenanceModal = true; }
  closeMaintenanceModal(): void { this.showMaintenanceModal = false; }

  onMaintenanceCreated(): void {
    this.loadMaintenances();
    this.applyFilters();
  }

  trackByMaintenanceId = trackById;

  editMaintenance(maintenance: VehicleMaintenance): void {
    this.maintenanceService.getMaintenanceById(maintenance.id_mantenimiento).subscribe({
      next: (data: VehicleMaintenance) => {
        this.maintenanceToEdit = data;
        this.showEditModal = true;
      },
      error: err => console.error('Error al cargar mantenimiento', err)
    });
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.maintenanceToEdit = null;
  }

  onMaintenanceUpdated(): void {
    this.loadMaintenances();
    this.applyFilters();
    this.closeEditModal();
  }

  deleteMaintenance(maintenance: VehicleMaintenance): void {
    this.alertService.confirm(
      'Confirmar eliminación',
      `¿Está seguro de eliminar este mantenimiento del vehículo ${maintenance.unidad.unidad}?`,
      () => {
        this.maintenanceService.removeMaintenance(maintenance.id_mantenimiento).subscribe({
          next: () => {
            this.maintenanceList = this.maintenanceList.filter(m => m.id_mantenimiento !== maintenance.id_mantenimiento);
            this.applyFilters();
            this.alertService.SuccesNotify('Mantenimiento eliminado exitosamente.');
          },
          error: () => {
            this.alertService.errorReport(
              'Error',
              'Ocurrió un error al eliminar el mantenimiento. Intenta de nuevo.'
            );
          }
        });
      }
    );
  }

  private applyFilters(): void {
    const { searchTerm, unidadFilter } = this.searchForm.value;

    let data = filterData(this.maintenanceList, searchTerm, [
      'unidad',
      'taller',
      'descripcion'
    ]);

    if (unidadFilter !== 'todas') {
      data = data.filter(m => m.unidad.unidad === unidadFilter);
    }

    data = sortByColumn(data, this.sortColumn, this.sortDirection);

    this.filteredMaintenance = data;
    this.adjustPageIfEmpty();
  }

  private getCurrentItemsPerPage(): number {
    return this.viewMode === 'table' ? 10 : 6;
  }

  private adjustPageIfEmpty(): void {
    const itemsPerPage = this.getCurrentItemsPerPage();
    const totalItems = this.filteredMaintenance.length;
    const lastPage = Math.ceil(totalItems / itemsPerPage) || 1;

    if (this.page > lastPage) {
      this.page = lastPage;
    }
  }

  getTotalMaintenanceCount(): number {
    return this.maintenanceList.length;
  }
}
