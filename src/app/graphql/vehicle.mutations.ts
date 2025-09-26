import { gql } from 'apollo-angular';

export const CREATE_VEHICLE = gql`
  mutation CreateVehicle($createVehicleInput: CreateVehicleInput!) {
    createVehicle(createVehicleInput: $createVehicleInput) {
      id_unidad
      unidad
      modelo
      id_tipo_vehiculo
      id_estado_unidad
      descripcion
      kilometraje
      activo
      fecha_creacion
      fecha_actualizacion
      usuario_creacion
    }
  }
`;

export const UPDATE_VEHICLE = gql`
  mutation UpdateVehicle($updateVehicleInput: UpdateVehicleInput!) {
    updateVehicle(updateVehicleInput: $updateVehicleInput) {
      id_unidad
      unidad
      modelo
      id_tipo_vehiculo
      id_estado_unidad
      descripcion
      kilometraje
    }
  }
`;

export const REMOVE_VEHICLE = gql`
  mutation RemoveVehicle($removeVehicleId: Int!) {
    removeVehicle(id: $removeVehicleId) {
      id_unidad
      unidad
      modelo
      id_tipo_vehiculo
      id_estado_unidad
      descripcion
      kilometraje
      activo
      usuario_creacion
    }
  }
`;
