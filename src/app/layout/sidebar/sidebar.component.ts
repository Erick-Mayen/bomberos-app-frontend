import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  badgeClass?: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [CommonModule, RouterModule, FontAwesomeModule]
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'tachometer-alt',
      route: '/app/dashboard'
    },
    {
      label: 'Emergencias',
      icon: 'exclamation-triangle',
      route: '/emergencias',
    },
    {
      label: 'Personal',
      icon: 'users',
      route: '/app/personal'
    },
    {
      label: 'Usuarios',
      icon: 'users',
      route: '/app/usuarios'
    },
    {
      label: 'Vehículos',
      icon: 'truck',
      route: '/app/vehiculos'
    },
    {
      label: 'Equipos',
      icon: 'tools',
      route: '/equipos'
    },
    {
      label: 'Reportes',
      icon: 'chart-bar',
      route: '/reportes'
    },
    {
      label: 'Configuración',
      icon: 'cog',
      route: '/configuracion'
    }
  ];

  private isMobile(): boolean {
    return window.innerWidth <= 768;
  }

  onNavItemClick(): void {
    if (this.isMobile()) {
      this.collapsed = true;
      this.collapsedChange.emit(this.collapsed);
    }
  }

  onEmergencyAction(): void {
    if (this.isMobile()) {
      this.collapsed = true;
      this.collapsedChange.emit(this.collapsed);
    }
    // Aquí va tu lógica para nueva emergencia
    console.log('Nueva emergencia');
  }

  onAmbulanceAction(): void {
    if (this.isMobile()) {
      this.collapsed = true;
      this.collapsedChange.emit(this.collapsed);
    }
    // Aquí va tu lógica para solicitar ambulancia
    console.log('Solicitar ambulancia');
  }

  // CAMBIO: Listener para colapsar sidebar al hacer scroll en móvil
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    if (this.isMobile() && !this.collapsed) {
      this.collapsed = true;
      this.collapsedChange.emit(this.collapsed);
    }
  }
}
