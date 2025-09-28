import { gql } from "apollo-angular";

export const CREATE_MAINTENANCE = gql`
  mutation CreateMaintenance($createVehicleMaintenanceInput: CreateVehicleMaintenanceInput!) {
    createMaintenance(createVehicleMaintenanceInput: $createVehicleMaintenanceInput) {
      id_mantenimiento
      id_unidad
      fecha_mantenimiento
      descripcion
      taller
      kilometraje
      costo
      proximo_mantenimiento
      activo
    }
  }
`;

export const UPDATE_MAINTENANCE = gql`
  mutation UpdateMaintenance($updateVehicleMaintenanceInput: UpdateVehicleMaintenanceInput!) {
    updateMaintenance(updateVehicleMaintenanceInput: $updateVehicleMaintenanceInput) {
      id_mantenimiento
      id_unidad
      fecha_mantenimiento
      descripcion
      taller
      kilometraje
      costo
      proximo_mantenimiento
      activo
    }
  }
`;

export const REMOVE_MAINTENANCE = gql`
  mutation RemoveMaintenance($removeMaintenanceId: Int!) {
    removeMaintenance(id: $removeMaintenanceId) {
      id_mantenimiento
      activo
    }
  }
`;
