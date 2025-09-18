import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PersonalComponent } from '../AgregarPersonal/personal.component';
import { PersonalCardsComponent } from './Personal-Cards/personal-cards.component';
import { PersonalTableComponent } from './Personal-Table/personal-table.component';
import { PersonalService } from '../../services/personal.service';
import { PersonalGraphQL, Personal, TypesPersonal } from '../../interfaces';

type ViewMode = 'table' | 'cards';
type SortColumn = 'nombre' | 'tipo_personal' | 'fecha_ingreso' | 'activo';
type SortDirection = 'desc' | 'asc';

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
  itemsPerPage = 0;
  tiposPersonal: TypesPersonal[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private personalService: PersonalService
  ) {
    this.searchForm = this.formBuilder.group({
      searchTerm: [''],
      tipoFilter: ['todos']
    });
  }

  ngOnInit(): void {
    this.searchForm.valueChanges.subscribe(() => this.filterAndSortPersonal());
    this.loadTiposPersonal();
    this.loadPersonal();
  }

  private loadTiposPersonal(): void {
    this.personalService.getAllTypes().subscribe({
      next: (data: TypesPersonal[]) => {
        this.tiposPersonal = data;
      },
      error: err => console.error('Error al cargar tipos de personal', err)
    });
  }

  private loadPersonal(): void {
    this.personalService.getAllPersonal().subscribe({
      next: (data: PersonalGraphQL[]) => {
        // Mapear datos del backend a la estructura del componente
        this.personalList = data.map(p => ({
          id: p.id_personal.toString(),
          primer_nombre: p.primer_nombre,
          segundo_nombre: p.segundo_nombre,
          primer_apellido: p.primer_apellido,
          segundo_apellido: p.segundo_apellido,
          tipo_personal: p.tipo_personal.nombre.toLowerCase(),
          fecha_ingreso: new Date(p.fecha_creacion),
          activo: p.activo
        }));

        this.filteredPersonal = [...this.personalList];
        this.filterAndSortPersonal();
      },
      error: err => console.error('Error al cargar personal', err)
    });
  }

  // Getters para controles del formulario
  get searchTermControl(): FormControl {
    return this.searchForm.get('searchTerm') as FormControl;
  }

  get tipoFilterControl(): FormControl {
    return this.searchForm.get('tipoFilter') as FormControl;
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

  setViewMode(mode: ViewMode): void {
    this.viewMode = mode;
    localStorage.setItem('personalViewMode', mode);
  }

  sortBy(column: string): void {
    const col = column as SortColumn;
    if (this.sortColumn === col) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = col;
      this.sortDirection = 'asc';
    }
    this.filterAndSortPersonal();
  }

  private sortPersonal(personal: Personal[]): Personal[] {
    return personal.sort((a, b) => {
      let valueA: any, valueB: any;

      switch (this.sortColumn) {
        case 'nombre':
          valueA = this.getPersonalFullName(a).toLowerCase();
          valueB = this.getPersonalFullName(b).toLowerCase();
          break;
        case 'tipo_personal':
          valueA = this.getTipoPersonalLabel(a.tipo_personal);
          valueB = this.getTipoPersonalLabel(b.tipo_personal);
          break;
        case 'fecha_ingreso':
          valueA = a.fecha_ingreso.getTime();
          valueB = b.fecha_ingreso.getTime();
          break;
        case 'activo':
          valueA = a.activo ? 1 : 0;
          valueB = b.activo ? 1 : 0;
          break;
        default: return 0;
      }

      return (valueA < valueB ? -1 : valueA > valueB ? 1 : 0) * (this.sortDirection === 'asc' ? 1 : -1);
    });
  }

  openPersonalModal(): void { this.showPersonalModal = true; }
  closePersonalModal(): void { this.showPersonalModal = false; }

  onPersonalCreated(personalData: any): void {
    const newPersonal: Personal = {
      id: Date.now().toString(),
      ...personalData,
      fecha_ingreso: new Date(),
      activo: true
    };
    this.personalList.unshift(newPersonal);
    this.filterAndSortPersonal();
  }

  trackByPersonalId(item: Personal): string { return item.id; }

  filterAndSortPersonal(): void {
    this.filterPersonal();
    this.filteredPersonal = this.sortPersonal(this.filteredPersonal);
    this.adjustPageIfEmpty();
  }

  filterPersonal(): void {
    const { searchTerm, tipoFilter } = this.searchForm.value;
    this.filteredPersonal = this.personalList.filter(p => {
      const matchesSearch = !searchTerm ||
        p.primer_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.primer_apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.segundo_nombre && p.segundo_nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.segundo_apellido && p.segundo_apellido.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = tipoFilter === 'todos' || p.tipo_personal === tipoFilter;
      return matchesSearch && matchesType;
    });
  }

  getPersonalFullName(personal: Personal): string {
    const nombres = [personal.primer_nombre, personal.segundo_nombre].filter(Boolean).join(' ');
    const apellidos = [personal.primer_apellido, personal.segundo_apellido].filter(Boolean).join(' ');
    return `${nombres} ${apellidos}`;
  }

  getTipoPersonalLabel(tipo: string): string {
    const tipoObj = this.tiposPersonal.find(t => t.nombre.toLowerCase() === tipo.toLowerCase());
    return tipoObj ? tipoObj.nombre : tipo;
  }

  editPersonal(personal: Personal): void { console.log('Editar personal:', personal); }

  deletePersonal(personal: Personal): void {
    if (confirm(`¿Está seguro de eliminar permanentemente a ${this.getPersonalFullName(personal)}?`)) {
      this.personalList = this.personalList.filter(p => p.id !== personal.id);
      this.filterAndSortPersonal();
    }
  }

  getActivePersonalCount(): number { return this.personalList.filter(p => p.activo).length; }
  getTotalPersonalCount(): number { return this.personalList.length; }

  clearFilters(): void { this.searchForm.reset({ searchTerm: '', tipoFilter: 'todos' }); }
  hasActiveFilters(): boolean { return !!this.searchForm.value.searchTerm || this.searchForm.value.tipoFilter !== 'todos'; }
}
