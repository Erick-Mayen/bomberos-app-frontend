import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { User } from '../../../../interfaces';

@Component({
  selector: 'app-users-cards',
  standalone: true,
  imports: [NgxPaginationModule, CommonModule, FontAwesomeModule],
  templateUrl: './users-cards.component.html',
  styleUrls: ['../users-list.component.scss']
})
export class UsersCardsComponent {
  @Input() usersList: User[] = [];
  @Input() page: number = 1;
  @Input() itemsPerPage: number = 0;
  @Input() getUserName!: (user: User) => string;
  @Input() getPersonalAsignado!: (usuario: User) => string;
  @Output() edit = new EventEmitter<User>();
  @Output() delete = new EventEmitter<User>();

  trackByUserId(index: number, user: User): number {
    return user.id;
  }
}
