import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kilometraje'
})
export class KilometrajePipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null) return '0 km';
    return `${value.toLocaleString('es-GT')} km`;
  }
}
