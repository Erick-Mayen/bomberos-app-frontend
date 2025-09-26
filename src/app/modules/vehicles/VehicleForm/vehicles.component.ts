import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { VehicleService } from '../../../services/vehicle.service';
import { VehicleType, VehicleState, Vehicle } from '../../../interfaces/vehicle.interface';
import { AlertService } from '../../../services/alert.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, NgSelectModule],
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehicleComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() vehicleToEdit: Vehicle | null = null;
  @Input() modalTitle = 'Agregar Vehículo';
  @Input() submitLabel = 'Agregar Vehículo';
  @Output() closeModal = new EventEmitter<void>();
  @Output() formSuccess = new EventEmitter<Vehicle>();

  vehicleForm: FormGroup;
  isSubmitting = false;
  vehicleTypes: VehicleType[] = [];
  vehicleStates: VehicleState[] = [];

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private alertService: AlertService,
    private authService: AuthService
  ) {
    this.vehicleForm = this.fb.group({
      unidad: ['', [Validators.required]],
      modelo: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      kilometraje: [0, [Validators.required, Validators.min(0)]],
      id_tipo_vehiculo: [null, [Validators.required]],
      id_estado_unidad: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadVehicleTypes();
    this.loadVehicleStates();
  }

  ngOnChanges(): void {
    if (this.vehicleToEdit) {
      this.vehicleForm.patchValue({
        unidad: this.vehicleToEdit.unidad,
        modelo: this.vehicleToEdit.modelo,
        descripcion: this.vehicleToEdit.descripcion,
        kilometraje: this.vehicleToEdit.kilometraje,
        id_tipo_vehiculo: this.vehicleToEdit.tipo_vehiculo.id_tipo_vehiculo,
        id_estado_unidad: this.vehicleToEdit.estado_unidad.id_estado
      });

      this.modalTitle = 'Editar Vehículo';
      this.submitLabel = 'Editar Vehículo';
    } else {
      this.vehicleForm.reset();
      this.modalTitle = 'Agregar Vehículo';
      this.submitLabel = 'Agregar Vehículo';
    }
  }

  private loadVehicleTypes(): void {
    this.vehicleService.getAllVehicleTypes().subscribe({
      next: (data: VehicleType[]) => this.vehicleTypes = data,
      error: err => console.error('Error al cargar tipos de vehículo', err)
    });
  }

  private loadVehicleStates(): void {
    this.vehicleService.getAllVehicleStates().subscribe({
      next: (data: VehicleState[]) => this.vehicleStates = data,
      error: err => console.error('Error al cargar estados de unidad', err)
    });
  }

  onSubmit(): void {
    if (!this.vehicleForm.valid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting = true;
    const formData = this.vehicleForm.value;
    const payload = {
      ...formData,
      id_tipo_vehiculo: Number(formData.id_tipo_vehiculo),
      id_estado_unidad: Number(formData.id_estado_unidad),
      ...(this.vehicleToEdit
        ? { id_vehiculo: this.vehicleToEdit.id_unidad }
        : {usuario_creacion: this.authService.getCurrentUser()?.id_usuario})
    };

    console.log('Payload final que se envía al servicio:', payload);
    const request$ = this.vehicleToEdit
      ? this.vehicleService.updateVehicle(payload)
      : this.vehicleService.createVehicle(payload);

    request$.subscribe({
      next: (result) => {
        this.alertService.SuccesNotify(this.vehicleToEdit ? 'Personal actualizado exitosamente' : 'Personal creado exitosamente');
        this.formSuccess.emit(result);
        this.isSubmitting = false;
        this.onCancel();
      },
      error: () => {
        this.alertService.errorReport(
          'Error',
          this.vehicleToEdit ? 'Error al actualizar el personal' : 'Error al crear el Vehículo'
        );
        this.isSubmitting = false;
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.vehicleForm.controls).forEach(key => {
      this.vehicleForm.get(key)?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.vehicleForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Este campo es requerido';
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.vehicleForm.get(fieldName);
    return !!(control?.invalid && control.touched);
  }

  onCancel(): void {
    this.vehicleForm.reset();
    this.closeModal.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) this.onCancel();
  }
}
