import { gql } from 'apollo-angular';

export const CREATE_USER = gql`
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      id_usuario
      nombre_usuario
      contrasenia
      id_personal
      id_rol
      activo
      usuario_creacion
      fecha_creacion
      fecha_actualizacion
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($updateUserInput: UpdateUserInput!) {
    updateUser(updateUserInput: $updateUserInput) {
      id_usuario
      nombre_usuario
      contrasenia
      id_personal
      id_rol
      activo
      usuario_creacion
      fecha_creacion
      fecha_actualizacion
    }
  }
`;

export const REMOVE_USER = gql`
  mutation RemoveUser($removeUserId: Int!) {
    removeUser(id: $removeUserId) {
      id_usuario
      nombre_usuario
      id_rol
      activo
      usuario_creacion
      fecha_creacion
      fecha_actualizacion
    }
  }
`;
