import { Injectable } from '@angular/core';
import { MaintenanceService } from '../maintenance.service';
import { VehicleMaintenance } from '../../interfaces';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { take } from 'rxjs/operators';
import { imageToBase64 } from '../../utils/image-to-base64';

(pdfMake as any).vfs = (pdfFonts as any).vfs;

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private maintenanceService: MaintenanceService) { }

  async generarReportePorUnidad(idUnidad: number, nombreUnidad: string) {
    try {
      const logoBase64 = await imageToBase64('assets/logo-bomb46.png'); // <-- Aquí
      this.maintenanceService.getMaintenanceByVehicleId(idUnidad)
        .pipe(take(1))
        .subscribe({
          next: (mantenimientos: VehicleMaintenance[]) => {
            this.crearPDF(mantenimientos, nombreUnidad, logoBase64);
          },
          error: (err) => console.error('Error obteniendo mantenimientos', err)
        });
    } catch (err) {
      console.error('Error cargando logo:', err);
    }
  }

  private crearPDF(mantenimientos: VehicleMaintenance[], nombreUnidad: string, logoBase64: string) {
  const unidad = mantenimientos[0]?.unidad;
  const contenido: any[] = [];

  // Header con logo y títulos
  contenido.push({
    columns: [
      { image: logoBase64, width: 80 },
      {
        stack: [
          { text: 'ASOCIACION NACIONAL DE BOMBEROS MUNICIPALES DEPARTAMENTALES', style: 'header', alignment: 'center' },
          { text: 'ESTACIÓN NO.46 PALENCIA', style: 'header', alignment: 'center' },
          { text: `Reporte de Mantenimientos o reparaciones - Unidad: ${nombreUnidad}`, style: 'subheader', alignment: 'center', margin: [0, 15, 0, 0] }
        ],
        width: '*'
      }
    ],
    columnGap: 10,
    margin: [0, 0, 0, 20]
  });

  // Datos de la unidad
  contenido.push({ text: 'Datos de la Unidad', style: 'sectionHeader' });
  contenido.push({
    stack: [
      { text: [{ text: 'Unidad: ', bold: true }, unidad?.unidad] },
      { text: [{ text: 'Descripción: ', bold: true }, unidad?.descripcion ?? 'N/E'] },
      { text: [{ text: 'Modelo: ', bold: true }, unidad?.modelo] },
      { text: [{ text: 'Tipo de vehículo: ', bold: true }, unidad?.tipo_vehiculo?.nombre] }
    ],
    margin: [0, 0, 0, 15]
  });

  // Mantenimientos realizados
  contenido.push({ text: 'Mantenimientos o reparaciones realizados a la unidad:', style: 'sectionHeader' });

  mantenimientos.forEach((m) => {
    // Línea separadora
    contenido.push({
      canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#000' }],
      margin: [0, 10, 0, 10]
    });

    // Fecha
    contenido.push({ text: [{ text: 'Fecha del servicio: ', bold: true }, this.formatearFecha(m.fecha_mantenimiento)], margin: [0, 0, 0, 3] });

    // Descripción
    contenido.push({ text: [{ text: 'Descripción: ', bold: true }, m.descripcion ?? 'N/E'], margin: [0, 0, 0, 3] });

    // Taller
    contenido.push({ text: [{ text: 'Taller: ', bold: true }, m.taller ?? 'N/E'], margin: [0, 0, 0, 3] });

    // Kilometraje
    contenido.push({ text: [{ text: 'Kilometraje: ', bold: true }, this.formatearKm(m.kilometraje)], margin: [0, 0, 0, 3] });

    // Próximo mantenimiento
    contenido.push({ text: [{ text: 'Próximo mantenimiento (km): ', bold: true }, this.formatearKm(m.proximo_mantenimiento)], margin: [0, 0, 0, 3] });

    // Costo
    contenido.push({ text: [{ text: 'Costo: ', bold: true }, m.costo?.toLocaleString('es-GT', { style: 'currency', currency: 'GTQ' }) ?? 'N/E'], margin: [0, 0, 0, 3] });
  });

  const docDefinition: any = {
    content: contenido,
    styles: {
      header: { fontSize: 16, bold: true },
      subheader: { fontSize: 14, bold: true },
      sectionHeader: { fontSize: 13, bold: true, margin: [0, 10, 0, 5] }
    },
    defaultStyle: { fontSize: 11 },
    pageMargins: [40, 40, 40, 40]
  };

  (pdfMake as any).createPdf(docDefinition).open();
}


  // Formatear fecha a DD/MM/YYYY
  private formatearFecha(fecha: string | null): string {
  if (!fecha) return 'N/E';
  const [year, month, day] = fecha.split('T')[0].split('-'); // solo la parte YYYY-MM-DD
  return `${day}/${month}/${year}`;
}

  // Formatear kilometraje y próximo mantenimiento
  private formatearKm(km: number | null): string {
    if (km == null) return 'N/E';
    return `${km.toLocaleString('es-GT')} km`;
  }
}
