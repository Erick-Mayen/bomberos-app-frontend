import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Personal } from '../../../../interfaces';

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
  @Input() itemsPerPage: number = 0;
  @Input() getPersonalFullName!: (personal: Personal) => string;
  @Output() edit = new EventEmitter<Personal>();
  @Output() delete = new EventEmitter<Personal>();

  trackByPersonalId(index: number, personal: Personal): string {
    return personal.id;
  }
}
