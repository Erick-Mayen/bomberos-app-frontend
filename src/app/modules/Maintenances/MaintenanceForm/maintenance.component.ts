import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaintenanceService } from '../../../services/maintenance.service';
import { VehicleService } from '../../../services/vehicle.service';
import { Vehicle, VehicleMaintenance } from '../../../interfaces';
import { AlertService } from '../../../services/alert.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, NgSelectModule],
  templateUrl: './maintenance.component.html',
  styleUrls: ['../../../../shared/styles/modal.component.scss']
})
export class MaintenanceComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() maintenanceToEdit: VehicleMaintenance | null = null;
  @Input() modalTitle = 'Agregar Servicio';
  @Input() submitLabel = 'Agregar Servicio';
  @Output() closeModal = new EventEmitter<void>();
  @Output() formSuccess = new EventEmitter<VehicleMaintenance>();

  maintenanceForm: FormGroup;
  isSubmitting = false;
  vehicles: Vehicle[] = [];

  constructor(
    private fb: FormBuilder,
    private maintenanceService: MaintenanceService,
    private vehicleService: VehicleService,
    private alertService: AlertService,
    private authService: AuthService
  ) {
    this.maintenanceForm = this.fb.group({
      id_unidad: [null, [Validators.required]],
      fecha_mantenimiento: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      taller: ['',],
      kilometraje: [0, [Validators.required, Validators.min(0)]],
      costo: [0,],
      proximo_mantenimiento: [0,]
    });
  }

  ngOnInit(): void {
    this.loadVehicles();
  }

  ngOnChanges(): void {
    if (this.maintenanceToEdit) {
      const formatDate = (date: Date | string) => {
        const d = new Date(date);
        const month = String(d.getUTCMonth() + 1).padStart(2, '0');
        const day = String(d.getUTCDate()).padStart(2, '0');
        const year = d.getUTCFullYear();
        return `${year}-${month}-${day}`;
      };

      this.maintenanceForm.patchValue({
        id_unidad: this.maintenanceToEdit.id_unidad,
        fecha_mantenimiento: formatDate(this.maintenanceToEdit.fecha_mantenimiento),
        descripcion: this.maintenanceToEdit.descripcion,
        taller: this.maintenanceToEdit.taller,
        kilometraje: this.maintenanceToEdit.kilometraje,
        costo: this.maintenanceToEdit.costo,
        proximo_mantenimiento: this.maintenanceToEdit.proximo_mantenimiento
      });

      this.modalTitle = 'Editar Servicio';
      this.submitLabel = 'Editar Servicio';
    } else {
      this.maintenanceForm.reset();
      this.modalTitle = 'Agregar Servicio';
      this.submitLabel = 'Agregar Servicio';
    }
  }

  private loadVehicles(): void {
    this.vehicleService.getAllVehicles().subscribe({
      next: (data: Vehicle[]) => this.vehicles = data.filter(v => v.activo),
      error: err => console.error('Error al cargar unidades', err)
    });
  }

  onSubmit(): void {
    if (!this.maintenanceForm.valid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting = true;
    const formData = this.maintenanceForm.value;
    const payload = {
      ...formData,
      id_unidad: Number(formData.id_unidad),
      ...(this.maintenanceToEdit
        ? { id_mantenimiento: this.maintenanceToEdit.id_mantenimiento }
        : { usuario_creacion: this.authService.getCurrentUser()?.id_usuario })
    };

    const request$ = this.maintenanceToEdit
      ? this.maintenanceService.updateMaintenance(payload)
      : this.maintenanceService.createMaintenance(payload);

    request$.subscribe({
      next: (result) => {
        this.alertService.SuccesNotify(
          this.maintenanceToEdit ? 'Servicio actualizado exitosamente' : 'Servicio creado exitosamente'
        );
        this.formSuccess.emit(result);
        this.isSubmitting = false;
        this.onCancel();
      },
      error: () => {
        this.alertService.errorReport(
          'Error',
          this.maintenanceToEdit ? 'Error al actualizar mantenimiento' : 'Error al crear mantenimiento'
        );
        this.isSubmitting = false;
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.maintenanceForm.controls).forEach(key => {
      this.maintenanceForm.get(key)?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.maintenanceForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Este campo es requerido';
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.maintenanceForm.get(fieldName);
    return !!(control?.invalid && control.touched);
  }

  onCancel(): void {
    this.maintenanceForm.reset();
    this.closeModal.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) this.onCancel();
  }

  allowOnlyNumbers(event: KeyboardEvent) {
  if (!/[0-9]/.test(event.key)) {
    event.preventDefault();
  }
}

  onKilometrajeInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const numericValue = input.value.replace(/\D/g, ''); // elimina todo lo que no sea dígito
    this.maintenanceForm.get('kilometraje')?.setValue(Number(numericValue));
  }

  onProximoMantenimientoInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const numericValue = input.value.replace(/,/g, '');
    this.maintenanceForm.get('proximo_mantenimiento')?.setValue(Number(numericValue));
  }
}
