export interface UserGraphQL {
  id_usuario: number;
  nombre_usuario: string;
  contrasenia: string;
  id_personal: number;
  id_rol: number;
  activo: boolean;
  usuario_creacion: number;
  fecha_creacion: string;
  fecha_actualizacion?: string;
  rol: {
    id_rol: number;
    nombre_rol: string;
  };
  personalAsignado?: {
    id_personal: number;
    primer_nombre: string;
    primer_apellido: string;
  } | null;
}

export interface User {
  id: number;
  nombre_usuario: string;
  fecha_ingreso: Date;
  activo: boolean;
  rol: string;
  personalAsignado?: {
    id_personal: number;
    primer_nombre: string;
    primer_apellido: string;
  } | null;
}

export interface Rol {
  id_rol: number;
  nombre_rol: string;
}
