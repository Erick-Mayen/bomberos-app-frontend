import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, catchError, timeout } from 'rxjs/operators';
import { throwError } from 'rxjs';

const LOGIN_MUTATION = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      access_token
      user {
        id_usuario
        nombre_usuario
        rol {
          nombre_rol
        }
        personal {
          nombres
        }
      }
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private apollo: Apollo) { }

  login(nombre_usuario: string, contrasenia: string) {
    return this.apollo.mutate({
      mutation: LOGIN_MUTATION,
      variables: { loginInput: { nombre_usuario, contrasenia } }
    }).pipe(
      timeout(10000),
      map((result: any) => {
        if (!result.data || !result.data.login) {
          throw new Error('LOGIN_FAILED');
        }

        const data = result.data.login;

        if (data?.access_token) {
          localStorage.setItem('token', data.access_token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        return data;
      }),
      catchError((error) => {
        if (error.name === 'TimeoutError') {
          return throwError(() => new Error('TIMEOUT'));
        }

        if (error.networkError) {
          if (navigator.onLine) {
            return throwError(() => new Error('SERVER_ERROR'));
          } else {
            return throwError(() => new Error('NO_CONNECTION'));
          }
        }

        return throwError(() => error);
      })

    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
