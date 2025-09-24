import { gql } from 'apollo-angular';

export const FIND_ALL_USERS = gql`
  query FindAllUsers {
    findAllUsers {
      id_usuario
      nombre_usuario
      contrasenia
      id_personal
      id_rol
      activo
      usuario_creacion
      fecha_creacion
      fecha_actualizacion
      rol {
        id_rol
        nombre_rol
      }
      personalAsignado {
      id_personal
      primer_nombre
      primer_apellido
    }
    }
  }
`;

export const FIND_ALL_ROLES = gql`
  query FindAllRoles {
    findAllRoles {
      id_rol
      nombre_rol
    }
  }
`;

export const FIND_ONE_USER = gql`
  query FindOneUser($findOneUserId: Int!) {
    findOneUser(id: $findOneUserId) {
      id_usuario
      nombre_usuario
      contrasenia
      id_personal
      id_rol
      activo
      usuario_creacion
      fecha_creacion
      fecha_actualizacion
      personalAsignado {
        id_personal
        primer_nombre
        segundo_nombre
        primer_apellido
        segundo_apellido
      }
      rol {
        id_rol
        nombre_rol
      }
    }
  }
`;
