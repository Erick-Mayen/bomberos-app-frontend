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

export const REMOVE_PERSON = gql`
  mutation RemovePerson($removePersonId: Int!) {
    removePerson(id: $removePersonId) {
      id_personal
      primer_nombre
      segundo_nombre
      primer_apellido
      segundo_apellido
    }
  }
`;

export const UPDATE_PERSONAL = gql`
  mutation UpdatePersonal($updatePersonalInput: UpdatePersonalInput!) {
    updatePerson(updatePersonalInput: $updatePersonalInput) {
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
