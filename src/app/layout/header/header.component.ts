import { Component, Output, EventEmitter } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Notiflix from 'notiflix';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [FontAwesomeModule]
})
export class HeaderComponent {
  @Output() sidebarToggle = new EventEmitter<void>();
  currentUser: any;

  constructor(private authService: AuthService, private router: Router) {
  this.currentUser = this.authService.getCurrentUser();
}

  onToggleSidebar() {
    this.sidebarToggle.emit();
  }

  onLogout(event: Event) {
    event.preventDefault();

    Notiflix.Loading.standard('Cerrando sesión...');

    setTimeout(() => {
      this.authService.logout();
      Notiflix.Loading.remove();
      this.router.navigate(['/login']);
    }, 2000);
  }
}
