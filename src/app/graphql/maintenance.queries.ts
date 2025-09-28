import { gql } from 'apollo-angular';

export const FIND_ALL_MAINTENANCE = gql`
  query FindAllMaintenance {
    findAllMaintenance {
      id_mantenimiento
      id_unidad
      fecha_mantenimiento
      descripcion
      taller
      kilometraje
      costo
      proximo_mantenimiento
      activo
      usuario_creacion
      fecha_creacion
      unidad {
        unidad
        descripcion
        modelo
        tipo_vehiculo {
          nombre
        }
      }
    }
  }
`;

export const FIND_ONE_MAINTENANCE = gql`
  query FindOneMaintenance($findOneMaintenanceId: Int!) {
    findOneMaintenance(id: $findOneMaintenanceId) {
      id_mantenimiento
      id_unidad
      fecha_mantenimiento
      descripcion
      taller
      kilometraje
      costo
      proximo_mantenimiento
      activo
      usuario_creacion
      fecha_creacion
      unidad {
        unidad
        descripcion
        modelo
        tipo_vehiculo {
          nombre
        }
      }
    }
  }
`;

export const FIND_MAINTENANCE_BY_VEHICLE_ID = gql`
  query FindMaintenanceByVehicleId($idUnidad: Int!) {
    findMaintenanceByVehicleId(id_unidad: $idUnidad) {
      id_mantenimiento
      id_unidad
      fecha_mantenimiento
      descripcion
      taller
      kilometraje
      costo
      proximo_mantenimiento
      activo
      usuario_creacion
      fecha_creacion
      unidad {
        unidad
        descripcion
        modelo
        tipo_vehiculo {
          nombre
        }
      }
    }
  }
`;
