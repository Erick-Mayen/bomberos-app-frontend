import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { PersonalComponent } from '../AgregarPersonal/personal.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PersonalCardsComponent } from './Personal-Cards/personal-cards.component';
import { PersonalTableComponent } from './Personal-Table/personal-table.component';
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

type ViewMode = 'table' | 'cards';
type SortColumn = 'nombre' | 'tipo_personal' | 'fecha_ingreso' | 'activo';
type SortDirection = 'asc' | 'desc';

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
  sortDirection: SortDirection = 'asc';

  tiposPersonal = [
    { value: 'bombero', label: 'Bombero' },
    { value: 'oficial', label: 'Oficial' },
    { value: 'capitan', label: 'Capitán' },
    { value: 'teniente', label: 'Teniente' },
    { value: 'sargento', label: 'Sargento' },
    { value: 'voluntario', label: 'Voluntario' },
    { value: 'paramedico', label: 'Paramédico' },
    { value: 'conductor', label: 'Conductor' },
    { value: 'administrativo', label: 'Administrativo' }
  ];

  constructor(private formBuilder: FormBuilder) {
    this.searchForm = this.formBuilder.group({
      searchTerm: [''],
      tipoFilter: ['todos']
    });

    // Datos de ejemplo
    this.personalList = [
      { id: '1', primer_nombre: 'Carlos', segundo_nombre: 'Alberto', primer_apellido: 'González', segundo_apellido: 'Martínez', tipo_personal: 'capitan', fecha_ingreso: new Date('2020-01-15'), activo: true },
      { id: '2', primer_nombre: 'María', segundo_nombre: '', primer_apellido: 'Rodríguez', segundo_apellido: 'López', tipo_personal: 'bombero', fecha_ingreso: new Date('2021-03-10'), activo: true },
      { id: '3', primer_nombre: 'José', segundo_nombre: 'Luis', primer_apellido: 'Hernández', segundo_apellido: '', tipo_personal: 'paramedico', fecha_ingreso: new Date('2019-08-22'), activo: true },
      { id: '4', primer_nombre: 'Ana', segundo_nombre: 'Patricia', primer_apellido: 'Morales', segundo_apellido: 'Vega', tipo_personal: 'voluntario', fecha_ingreso: new Date('2022-05-18'), activo: false },
      { id: '5', primer_nombre: 'Roberto', segundo_nombre: 'Carlos', primer_apellido: 'Silva', segundo_apellido: 'Mendoza', tipo_personal: 'teniente', fecha_ingreso: new Date('2018-12-03'), activo: true },
      { id: '6', primer_nombre: 'Laura', segundo_nombre: '', primer_apellido: 'García', segundo_apellido: 'Torres', tipo_personal: 'conductor', fecha_ingreso: new Date('2023-02-14'), activo: true },
      { id: '7', primer_nombre: 'Miguel', segundo_nombre: 'Ángel', primer_apellido: 'Ramírez', segundo_apellido: 'Cruz', tipo_personal: 'sargento', fecha_ingreso: new Date('2017-09-08'), activo: true },
      { id: '8', primer_nombre: 'Carmen', segundo_nombre: 'Elena', primer_apellido: 'Jiménez', segundo_apellido: 'Flores', tipo_personal: 'administrativo', fecha_ingreso: new Date('2021-11-25'), activo: false }
    ];

    this.filteredPersonal = [...this.personalList];
  }

  // Getters para los controles del formulario
  get searchTermControl(): FormControl {
    return this.searchForm.get('searchTerm') as FormControl;
  }

  get tipoFilterControl(): FormControl {
    return this.searchForm.get('tipoFilter') as FormControl;
  }

  ngOnInit(): void {
    this.searchForm.valueChanges.subscribe(() => this.filterAndSortPersonal());
    this.filterAndSortPersonal();
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

  trackByPersonalId(index: number, item: Personal): string { return item.id; }

  filterAndSortPersonal(): void {
    this.filterPersonal();
    this.filteredPersonal = this.sortPersonal(this.filteredPersonal);
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
    const tipoObj = this.tiposPersonal.find(t => t.value === tipo);
    return tipoObj ? tipoObj.label : tipo;
  }

  togglePersonalStatus(personal: Personal): void {
    if (confirm(`¿Está seguro de ${personal.activo ? 'desactivar' : 'activar'} a ${this.getPersonalFullName(personal)}?`)) {
      personal.activo = !personal.activo;
      this.filterAndSortPersonal();
    }
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
  getInactivePersonalCount(): number { return this.personalList.filter(p => !p.activo).length; }

  exportToCSV(): void {
    const headers = ['ID', 'Nombre Completo', 'Tipo', 'Fecha de Ingreso', 'Estado'];
    const csvContent = this.filteredPersonal.map(p => [
      p.id,
      this.getPersonalFullName(p),
      this.getTipoPersonalLabel(p.tipo_personal),
      p.fecha_ingreso.toLocaleDateString('es-GT'),
      p.activo ? 'Activo' : 'Inactivo'
    ]);
    const csv = [headers, ...csvContent].map(row => row.map(f => `"${f}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `personal_bomberos_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  clearFilters(): void { this.searchForm.reset({ searchTerm: '', tipoFilter: 'todos' }); }
  hasActiveFilters(): boolean { return !!this.searchForm.value.searchTerm || this.searchForm.value.tipoFilter !== 'todos'; }
}
