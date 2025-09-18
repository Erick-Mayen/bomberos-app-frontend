import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../layout/header/header.component';
import { SidebarComponent } from '../layout/sidebar/sidebar.component';
import { FooterComponent } from '../layout/footer/fotter.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    RouterOutlet,
    FontAwesomeModule,
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ],
})
export class HomeComponent {
  sidebarCollapsed = false;

  onSidebarToggle() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}

