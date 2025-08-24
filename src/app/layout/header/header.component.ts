import { Component, Output, EventEmitter } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [FontAwesomeModule]
})
export class HeaderComponent {
  @Output() sidebarToggle = new EventEmitter<void>();

  onToggleSidebar() {
    this.sidebarToggle.emit();
  }
}
