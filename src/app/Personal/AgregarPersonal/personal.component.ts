import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-personal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() personalCreated = new EventEmitter<any>();

  personalForm: FormGroup;
  isSubmitting = false;

  tiposPersonal = [
    { value: 'bombero', label: 'Bombero' },
    { value: 'oficial', label: 'Oficial' },
    { value: 'capitan', label: 'Capitán' },
    { value: 'teniente', label: 'Teniente' },
    { value: 'sargento', label: 'Sargento' },
    { value: 'voluntario', label: 'Voluntario' },
    { value: 'paramedico', label: 'Paramédico' },
    { value: 'conductor', label: 'Conductor' },
    { value: 'administrativo', label: 'Administrativo' }
  ];

  constructor(private formBuilder: FormBuilder) {
    this.personalForm = this.formBuilder.group({
      primer_nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      segundo_nombre: ['', [Validators.maxLength(50)]],
      primer_apellido: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      segundo_apellido: ['', [Validators.maxLength(50)]],
      tipo_personal: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.personalForm.valid) {
      this.isSubmitting = true;
      const formData = this.personalForm.value;

      // Aquí integrarías con tu servicio existente
      console.log('Datos del personal:', formData);

      // Emitir el evento con los datos
      this.personalCreated.emit(formData);

      // Simular envío
      setTimeout(() => {
        this.isSubmitting = false;
        this.personalForm.reset();
        this.closeModal.emit();
      }, 1000);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.personalForm.controls).forEach(key => {
      const control = this.personalForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.personalForm.get(fieldName);

    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return 'Este campo es requerido';
      }
      if (control.errors['minlength']) {
        return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
      }
      if (control.errors['maxlength']) {
        return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
      }
    }
    return '';
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
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }
}
