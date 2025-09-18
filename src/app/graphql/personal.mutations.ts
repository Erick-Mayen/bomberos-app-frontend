import { gql } from 'apollo-angular';

export const CREATE_PERSONAL = gql`
  mutation CreatePersonal($createPersonalInput: CreatePersonalInput!) {
    createPerson(CreatePersonalInput: $createPersonalInput) {
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
    }
  }
`;
