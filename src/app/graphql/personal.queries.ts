import { gql } from 'apollo-angular';

export const FIND_ALL_PERSONAL = gql`
  query FindAllPersonal {
    findAllPersonal {
      id_personal
      primer_nombre
      segundo_nombre
      primer_apellido
      segundo_apellido
      activo
      fecha_creacion
      fecha_actualizacion
      usuario_creacion
      id_tipo_personal
      tipo_personal {
        id_tipo_personal
        nombre
      }
    }
  }
`;

export const FIND_ALL_TYPES = gql`
  query FindAllTypes {
    findAllTypes {
    id_tipo_personal
    nombre
    }
  }
`;
