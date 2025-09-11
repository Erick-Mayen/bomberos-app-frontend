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

@Component({
  selector: 'app-personal-cards',
  standalone: true,
  imports: [NgxPaginationModule, CommonModule, FontAwesomeModule],
  templateUrl: './personal-cards.component.html',
  styleUrls: ['../personal-list.component.scss']
})
export class PersonalCardsComponent {
  @Input() personalList: Personal[] = [];
  @Input() page: number = 1;

  @Output() edit = new EventEmitter<Personal>();
  @Output() toggle = new EventEmitter<Personal>();
  @Output() delete = new EventEmitter<Personal>();

  trackByPersonalId(index: number, personal: Personal): string {
  return personal.id;
}

  // Para mostrar nombres completos en el hijo
  getFullName(personal: Personal): string {
    const nombres = [personal.primer_nombre, personal.segundo_nombre].filter(Boolean).join(' ');
    const apellidos = [personal.primer_apellido, personal.segundo_apellido].filter(Boolean).join(' ');
    return `${nombres} ${apellidos}`;
  }
}
