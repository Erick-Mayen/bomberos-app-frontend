import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { VehicleService } from '../../../services/vehicle.service';
import { VehicleType, VehicleState, Vehicle } from '../../../interfaces/vehicle.interface';

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
    private vehicleService: VehicleService
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
      this.modalTitle = 'Editar Vehículo';
      this.submitLabel = 'Editar Vehículo';
      this.vehicleForm.patchValue({
        unidad: this.vehicleToEdit.unidad,
        modelo: this.vehicleToEdit.modelo,
        descripcion: this.vehicleToEdit.descripcion,
        kilometraje: this.vehicleToEdit.kilometraje,
        id_tipo_vehiculo: this.vehicleToEdit.tipo_vehiculo.id_tipo_vehiculo,
        id_estado_unidad: this.vehicleToEdit.estado_unidad.id_estado
      });
    } else {
      this.modalTitle = 'Agregar Vehículo';
      this.submitLabel = 'Agregar Vehículo';
      this.vehicleForm.reset();
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
    const request$ = this.vehicleToEdit
      ? this.vehicleService.updateVehicle({ ...formData, id_vehiculo: this.vehicleToEdit.id_unidad})
      : this.vehicleService.createVehicle(formData);

    request$.subscribe({
      next: (result) => {
        this.formSuccess.emit(result);
        this.isSubmitting = false;
        this.onCancel();
      },
      error: () => {
        console.error('Error al guardar el vehículo');
        this.isSubmitting = false;
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.vehicleForm.controls).forEach(key => {
      this.vehicleForm.get(key)?.markAsTouched();
    });
  }

  onCancel(): void {
    this.vehicleForm.reset();
    this.closeModal.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) this.onCancel();
  }
}
