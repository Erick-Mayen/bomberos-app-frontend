import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgFor, CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [FontAwesomeModule, NgFor, CommonModule],
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
})
export class DashboardComponent {
  fechaActual: Date = new Date();
  private relojSub?: Subscription;

  ngOnInit(): void {
    this.relojSub = interval(1000).subscribe(() => {
      this.fechaActual = new Date();
    });
  }

  ngOnDestroy(): void {
    this.relojSub?.unsubscribe();
  }

  stats = [
    {
      title: 'Emergencias Activas',
      value: '3',
      icon: 'exclamation-triangle',
      color: 'danger',
    },
    {
      title: 'Personal en Servicio',
      value: '24',
      icon: 'users',
      color: 'success',
    },
    {
      title: 'Vehículos Disponibles',
      value: '8',
      icon: 'truck',
      color: 'primary',
    },
  ];

  recentEmergencies = [
    {
      id: '2025-001',
      type: 'Incendio',
      address: 'Av. Principal 123',
      time: '14:30',
      status: 'En curso',
    },
    {
      id: '2025-002',
      type: 'Rescate',
      address: 'Calle 45 #67',
      time: '13:15',
      status: 'Resuelto',
    },
    {
      id: '2025-002',
      type: 'Rescate',
      address: 'Calle 45 #67',
      time: '13:15',
      status: 'Resuelto',
    },
    {
      id: '2025-002',
      type: 'Rescate',
      address: 'Calle 45 #67',
      time: '13:15',
      status: 'Resuelto',
    },
    {
      id: '2025-002',
      type: 'Rescate',
      address: 'Calle 45 #67',
      time: '13:15',
      status: 'Resuelto',
    },
    {
      id: '2025-002',
      type: 'Rescate',
      address: 'Calle 45 #67',
      time: '13:15',
      status: 'Resuelto',
    },
    {
      id: '2025-002',
      type: 'Rescate',
      address: 'Calle 45 #67',
      time: '13:15',
      status: 'Resuelto',
    },
    {
      id: '2025-002',
      type: 'Rescate',
      address: 'Calle 45 #67',
      time: '13:15',
      status: 'Resuelto',
    },
    {
      id: '2025-002',
      type: 'Rescate',
      address: 'Calle 45 #67',
      time: '13:15',
      status: 'Resuelto',
    },
    {
      id: '2025-002',
      type: 'Rescate',
      address: 'Calle 45 #67',
      time: '13:15',
      status: 'Resuelto',
    },
    {
      id: '2025-002',
      type: 'Rescate',
      address: 'Calle 45 #67',
      time: '13:15',
      status: 'Resuelto',
    },
    {
      id: '2025-002',
      type: 'Rescate',
      address: 'Calle 45 #67',
      time: '13:15',
      status: 'Resuelto',
    },
    {
      id: '2025-002',
      type: 'Rescate',
      address: 'Calle 45 #67',
      time: '13:15',
      status: 'Resuelto',
    },
    {
      id: '2025-002',
      type: 'Rescate',
      address: 'Calle 45 #67',
      time: '13:15',
      status: 'Resuelto',
    },
    {
      id: '2025-002',
      type: 'Rescate',
      address: 'Calle 45 #67',
      time: '13:15',
      status: 'Resuelto',
    },
    {
      id: '2025-002',
      type: 'Rescate',
      address: 'Calle 45 #67',
      time: '13:15',
      status: 'Resuelto',
    },
    {
      id: '2025-002',
      type: 'Rescate',
      address: 'Calle 45 #67',
      time: '13:15',
      status: 'Resuelto',
    },
    {
      id: '2025-002',
      type: 'Rescate',
      address: 'Calle 45 #67',
      time: '13:15',
      status: 'Resuelto',
    },
    {
      id: '2025-002',
      type: 'Rescate',
      address: 'Calle 45 #67',
      time: '13:15',
      status: 'Resuelto',
    },
    {
      id: '2025-002',
      type: 'Rescate',
      address: 'Calle 45 #67',
      time: '13:15',
      status: 'Resuelto',
    },
    {
      id: '2025-002',
      type: 'Rescate',
      address: 'Calle 45 #67',
      time: '13:15',
      status: 'Resuelto',
    },
    {
      id: '2025-002',
      type: 'Rescate',
      address: 'Calle 45 #67',
      time: '13:15',
      status: 'Resuelto',
    },
    {
      id: '2025-002',
      type: 'Rescate',
      address: 'Calle 45 #67',
      time: '13:15',
      status: 'Resuelto',
    },
    {
      id: '2025-002',
      type: 'Rescate',
      address: 'Calle 45 #67',
      time: '13:15',
      status: 'Resuelto',
    },
    {
      id: '2025-002',
      type: 'Rescate',
      address: 'Calle 45 #67',
      time: '13:15',
      status: 'Resuelto',
    },
    {
      id: '2025-002',
      type: 'Rescate',
      address: 'Calle 45 #67',
      time: '13:15',
      status: 'Resuelto',
    },
    {
      id: '2025-002',
      type: 'Rescate',
      address: 'Calle 45 #67',
      time: '13:15',
      status: 'Resuelto',
    },
    {
      id: '2025-002',
      type: 'Rescate',
      address: 'Calle 45 #67',
      time: '13:15',
      status: 'Resuelto',
    },
    {
      id: '2025-002',
      type: 'Rescate',
      address: 'Calle 45 #67',
      time: '13:15',
      status: 'Resuelto',
    },
    {
      id: '2025-002',
      type: 'Rescate',
      address: 'Calle 45 #67',
      time: '13:15',
      status: 'Resuelto',
    },
    {
      id: '2025-003',
      type: 'Accidente',
      address: 'Carrera 8 con 12',
      time: '12:45',
      status: 'En curso',
    },
  ];
}
