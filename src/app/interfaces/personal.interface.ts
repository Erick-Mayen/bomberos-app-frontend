export interface PersonalGraphQL{
  id_personal: number;
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  activo: boolean;
  fecha_creacion: string;
  fecha_actualizacion?: string;
  usuario_creacion: number;
  id_tipo_personal: number;
  tipo_personal: {
    id_tipo_personal: number;
    nombre: string;
  };
}

export interface Personal {
  id: string;
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  tipo_personal: string;
  fecha_ingreso: Date;
  activo: boolean;
}

export interface TypesPersonal {
  id_tipo_personal: number;
  nombre: string;
}
