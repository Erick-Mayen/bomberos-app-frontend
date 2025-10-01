import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PersonalGraphQL, TypesPersonal } from '../../../interfaces';
import { PersonalService } from '../../../services/personal.service';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-personal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './personal.component.html',
  styleUrls: ['../../../../shared/styles/modal.component.scss']
})
export class PersonalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() personalToEdit: PersonalGraphQL | null = null;
  @Input() modalTitle = 'Agregar Personal';
  @Input() submitLabel = 'Agregar Personal';
  @Output() closeModal = new EventEmitter<void>();
  @Output() formSuccess = new EventEmitter<any>();

  personalForm: FormGroup;
  isSubmitting = false;
  tiposPersonal: TypesPersonal[] = [];

  constructor(
    private fb: FormBuilder,
    private personalService: PersonalService,
    private authService: AuthService,
    private alertService: AlertService
  ) {
    this.personalForm = this.fb.group({
      primer_nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      segundo_nombre: ['', [Validators.maxLength(50)]],
      primer_apellido: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      segundo_apellido: ['', [Validators.maxLength(50)]],
      tipo_personal: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadTiposPersonal();
  }

  ngOnChanges(): void {
    if (this.personalToEdit) {
      this.personalForm.patchValue({
        primer_nombre: this.personalToEdit.primer_nombre,
        segundo_nombre: this.personalToEdit.segundo_nombre || '',
        primer_apellido: this.personalToEdit.primer_apellido,
        segundo_apellido: this.personalToEdit.segundo_apellido || '',
        tipo_personal: this.personalToEdit.id_tipo_personal
      });

      this.modalTitle = 'Editar Personal';
      this.submitLabel = 'Editar Personal';
    } else {
      this.personalForm.reset();
      this.modalTitle = 'Agregar Personal';
      this.submitLabel = 'Agregar Personal';
    }
  }

  private loadTiposPersonal(): void {
    this.personalService.getAllTypes().subscribe({
      next: (data: TypesPersonal[]) => (this.tiposPersonal = data),
      error: (err) => console.error('Error al cargar tipos de personal', err)
    });
  }

  onSubmit(): void {
    if (!this.personalForm.valid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting = true;
    const formData = this.personalForm.value;

    const input = {
      primer_nombre: formData.primer_nombre,
      segundo_nombre: formData.segundo_nombre || null,
      primer_apellido: formData.primer_apellido,
      segundo_apellido: formData.segundo_apellido || null,
      id_tipo_personal: Number(formData.tipo_personal),
      ...(this.personalToEdit
        ? { id_personal: this.personalToEdit.id_personal }
        : { usuario_creacion: this.authService.getCurrentUser()?.id_usuario || 1 })
    };

    const request$ = this.personalToEdit
      ? this.personalService.updatePersonal(input)
      : this.personalService.createPersonal(input);

    request$.subscribe({
      next: (result) => {
        this.alertService.SuccesNotify(this.personalToEdit ? 'Personal actualizado exitosamente' : 'Personal creado exitosamente');
        this.formSuccess.emit(result);
        this.isSubmitting = false;
        this.onCancel();
      },
      error: () => {
        this.alertService.errorReport(
          'Error',
          this.personalToEdit ? 'Error al actualizar el personal' : 'Error al crear el personal'
        );
        this.isSubmitting = false;
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.personalForm.controls).forEach((key) => {
      this.personalForm.get(key)?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.personalForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Este campo es requerido';
      if (control.errors['minlength']) return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
      if (control.errors['maxlength']) return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
    }
    return '';
  }

  allowLetters(event: KeyboardEvent) {
    const pattern = /[A-Za-zÁÉÍÓÚáéíóúÑñ ]/;
    if (!pattern.test(event.key)) event.preventDefault();
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.personalForm.get(fieldName);
    return !!(control?.invalid && control.touched);
  }

  onCancel(): void {
    this.personalForm.reset();
    this.closeModal.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) this.onCancel();
  }
}
