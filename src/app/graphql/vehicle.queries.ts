import { gql } from "apollo-angular";

export const FIND_ALL_VEHICLES = gql`
  query FindAllVehicles {
    findAllVehicles {
      id_unidad
      unidad
      modelo
      id_tipo_vehiculo
      id_estado_unidad
      tipo_vehiculo {
        id_tipo_vehiculo
        nombre
      }
      estado_unidad {
      id_estado
      nombre
      }
      descripcion
      kilometraje
      activo
      fecha_creacion
      fecha_actualizacion
      usuario_creacion
    }
  }
`;

export const FIND_ONE_VEHICLE = gql`
  query FindOneVehicle($findOneVehicleId: Int!) {
    findOneVehicle(id: $findOneVehicleId) {
      id_unidad
      unidad
      modelo
      id_tipo_vehiculo
      id_estado_unidad
      tipo_vehiculo {
        id_tipo_vehiculo
        nombre
      }
      estado_unidad {
      id_estado
      nombre
      }
      descripcion
      kilometraje
      activo
      fecha_creacion
      fecha_actualizacion
      usuario_creacion
    }
  }
`;

export const FIND_ALL_VEHICLE_TYPES = gql`
  query FindAllVehicleTypes {
    findAllVehicleTypes {
      id_tipo_vehiculo
      nombre
    }
  }
`;

export const FIND_ALL_VEHICLE_STATES = gql`
  query FindAllVehicleStates {
    findAllVehicleStates {
      id_estado
      nombre
    }
  }
`;
