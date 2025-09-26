export interface VehicleType {
  id_tipo_vehiculo: number;
  nombre: string;
}

export interface VehicleState {
  id_estado: number;
  nombre: string;
}

export interface Vehicle {
  id_unidad: number;
  unidad: string;
  modelo: string;
  id_tipo_vehiculo: number;
  id_estado_unidad: number;
  tipo_vehiculo: VehicleType;
  estado_unidad: VehicleState;
  descripcion: string | null;
  kilometraje: number | null;
  activo: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
  usuario_creacion: number | null;
}
