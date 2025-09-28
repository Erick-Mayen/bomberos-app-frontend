import { Vehicle } from "./vehicle.interface";

export interface VehicleMaintenance {
  id_mantenimiento: number;
  id_unidad: number;
  fecha_mantenimiento: string;
  descripcion: string | null;
  taller: string | null;
  kilometraje: number | null;
  costo: number | null;
  proximo_mantenimiento: number | null;
  activo: boolean;
  usuario_creacion: number | null;
  fecha_creacion: string;
  unidad: Vehicle;
}
