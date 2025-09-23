import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PersonalCardsComponent } from './Personal-Cards/personal-cards.component';
import { PersonalTableComponent } from './Personal-Table/personal-table.component';
import { PersonalService } from '../../../services/personal.service';
import { PersonalGraphQL, Personal, TypesPersonal } from '../../../interfaces';
import { AlertService } from '../../../services/alert.service';
import { filterData } from '../../../utils/filter.utils';
import { sortByColumn, SortDirection, toggleDirection } from '../../../utils/sort.util';
import { trackById } from '../../../utils/track.util';
import { PersonalComponent } from '../PersonalForm/personal.component';

type ViewMode = 'table' | 'cards';
type SortColumn = 'nombre' | 'tipo_personal' | 'fecha_ingreso' | 'activo';

@Component({
  selector: 'app-personal-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PersonalComponent,
    NgxPaginationModule,
    PersonalCardsComponent,
    PersonalTableComponent,
    FontAwesomeModule
  ],
  templateUrl: './personal-list.component.html',
  styleUrls: ['./personal-list.component.scss']
})
export class PersonalListComponent implements OnInit {
  page = 1;
  personalList: Personal[] = [];
  filteredPersonal: Personal[] = [];
  showPersonalModal = false;
  searchForm: FormGroup;
  viewMode: ViewMode = 'table';
  sortColumn: SortColumn = 'fecha_ingreso';
  sortDirection: SortDirection = 'desc';
  tiposPersonal: TypesPersonal[] = [];
  showEditModal = false;
  personalToEdit: PersonalGraphQL | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private personalService: PersonalService,
    private alertService: AlertService
  ) {
    this.searchForm = this.formBuilder.group({
      searchTerm: [''],
      tipoFilter: ['todos']
    });
  }

  ngOnInit(): void {
    this.searchForm.valueChanges.subscribe(() => this.applyFilters());
    this.loadTiposPersonal();
    this.loadPersonal();
  }

  private loadTiposPersonal(): void {
    this.personalService.getAllTypes().subscribe({
      next: (data: TypesPersonal[]) => this.tiposPersonal = data,
      error: err => console.error('Error al cargar tipos de personal', err)
    });
  }

  private loadPersonal(): void {
    this.personalService.getAllPersonal().subscribe({
      next: (data: PersonalGraphQL[]) => {
        this.personalList = data.map(p => ({
          id: p.id_personal,
          primer_nombre: p.primer_nombre,
          segundo_nombre: p.segundo_nombre,
          primer_apellido: p.primer_apellido,
          segundo_apellido: p.segundo_apellido,
          tipo_personal: p.tipo_personal.nombre.toLowerCase(),
          fecha_ingreso: new Date(p.fecha_creacion),
          activo: p.activo == true
        }));
        this.applyFilters();
      },
      error: err => console.error('Error al cargar personal', err)
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

  openPersonalModal(): void { this.showPersonalModal = true; }
  closePersonalModal(): void { this.showPersonalModal = false; }

  onPersonalCreated(personalData: any): void {
    const tipo = this.tiposPersonal.find(t => t.id_tipo_personal === personalData.id_tipo_personal)?.nombre.toLowerCase() || '';
    const newPersonal: Personal = {
      ...personalData,
      id: personalData.id_personal,
      fecha_ingreso: new Date(),
      activo: true,
      tipo_personal: tipo
    };
    this.personalList.unshift(newPersonal);
    this.applyFilters();
  }

  trackByPersonalId = trackById;

  private applyFilters(): void {
    const { searchTerm, tipoFilter } = this.searchForm.value;

    // Filtrado
    let data = filterData(this.personalList, searchTerm, [
      'primer_nombre',
      'segundo_nombre',
      'primer_apellido',
      'segundo_apellido'
    ]);

    // Mostrar solo activos
    data = data.filter(p => p.activo);

    if (tipoFilter !== 'todos') {
      data = data.filter(p => p.tipo_personal === tipoFilter);
    }

    // Ordenamiento
    data = sortByColumn(data, this.sortColumn, this.sortDirection);

    this.filteredPersonal = data;
    this.adjustPageIfEmpty();
  }

  getPersonalFullName(p: Personal): string {
    return [p.primer_nombre, p.segundo_nombre, p.primer_apellido, p.segundo_apellido]
      .filter(Boolean)
      .join(' ');
  }

  getTipoPersonalLabel(tipo: string): string {
    return this.tiposPersonal.find(t => t.nombre.toLowerCase() === tipo.toLowerCase())?.nombre ?? tipo;
  }

  editPersonal(personal: Personal): void {
    // Convertimos el modelo de UI al modelo GraphQL
    const personalGraphQL: PersonalGraphQL = {
      id_personal: personal.id,
      primer_nombre: personal.primer_nombre,
      segundo_nombre: personal.segundo_nombre,
      primer_apellido: personal.primer_apellido,
      segundo_apellido: personal.segundo_apellido,
      activo: personal.activo,
      fecha_creacion: personal.fecha_ingreso.toISOString(),
      usuario_creacion: 1,
      id_tipo_personal: this.tiposPersonal.find(t => t.nombre.toLowerCase() === personal.tipo_personal)?.id_tipo_personal || 0,
      tipo_personal: {
        id_tipo_personal: this.tiposPersonal.find(t => t.nombre.toLowerCase() === personal.tipo_personal)?.id_tipo_personal || 0,
        nombre: personal.tipo_personal
      }
    };

    this.personalToEdit = personalGraphQL;
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.personalToEdit = null;
  }

  onPersonalUpdated(updatedPersonal: PersonalGraphQL): void {
    const index = this.personalList.findIndex(p => p.id === updatedPersonal.id_personal);
    if (index !== -1) {
      const tipo = this.tiposPersonal.find(t => t.id_tipo_personal === updatedPersonal.id_tipo_personal)?.nombre.toLowerCase() || '';
      this.personalList[index] = {
        id: updatedPersonal.id_personal,
        primer_nombre: updatedPersonal.primer_nombre,
        segundo_nombre: updatedPersonal.segundo_nombre,
        primer_apellido: updatedPersonal.primer_apellido,
        segundo_apellido: updatedPersonal.segundo_apellido,
        tipo_personal: tipo,
        fecha_ingreso: new Date(updatedPersonal.fecha_creacion),
        activo: updatedPersonal.activo
      };
      this.applyFilters();
    }
    this.closeEditModal();
  }

  deletePersonal(personal: Personal): void {
    this.alertService.confirm(
      'Confirmar eliminación',
      `¿Está seguro de eliminar permanentemente a ${this.getPersonalFullName(personal)}?`,
      () => {
        this.personalService.deletePersonal(Number(personal.id)).subscribe({
          next: () => {
            this.personalList = this.personalList.filter(p => p.id !== personal.id);
            this.applyFilters();
            this.alertService.SuccesNotify('Personal eliminado exitosamente.');
          },
          error: () => {
            this.alertService.errorReport(
              'Error',
              'Ocurrió un error al eliminar el personal. Intenta de nuevo.'
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
    const totalItems = this.filteredPersonal.length;
    const lastPage = Math.ceil(totalItems / itemsPerPage) || 1;

    if (this.page > lastPage) {
      this.page = lastPage;
    }
  }

  getTotalPersonalCount(): number {
    return this.personalList.filter(p => p.activo).length;
  }
}
