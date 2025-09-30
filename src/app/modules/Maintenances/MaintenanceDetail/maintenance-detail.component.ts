import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleMaintenance } from '../../../interfaces';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { KilometrajePipe } from '../../../utils/kilometraje.pipe';

@Component({
  selector: 'app-maintenance-detail',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, KilometrajePipe],
  templateUrl: './maintenance-detail.component.html',
  styleUrls: ['./maintenance-detail.component.scss'],
})
export class MaintenanceDetailComponent {
  @Input() maintenance!: VehicleMaintenance | null;
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();

  close() {
    this.closeModal.emit();
  }
}
