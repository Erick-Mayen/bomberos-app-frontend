import { gql } from "apollo-angular";

export const LOGIN_MUTATION = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      access_token
      user {
        id_usuario
        nombre_usuario
        validar
        rol {
          nombre_rol
        }
        personalAsignado {
          primer_nombre
          primer_apellido
        }
      }
    }
  }
`;
