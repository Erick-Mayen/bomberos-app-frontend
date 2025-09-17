import { Injectable } from '@angular/core';
import { Apollo} from 'apollo-angular';
import { map, catchError, timeout } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { LOGIN_MUTATION } from '../graphql';

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
        if (result.errors?.length) {
          const msg = result.errors[0].message;
          throw new Error(msg);
        }

        if (!result.data || !result.data.login) {
          throw new Error('LOGIN_FALLIDO');
        }

        const data = result.data.login;
        if (data.access_token) {
          localStorage.setItem('token', data.access_token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        return data;
      }),
      catchError((error) => {
        const msg = error.message;
        if (msg === 'USUARIO_INACTIVO') return throwError(() => new Error('USUARIO_INACTIVO'));
        if (msg === 'LOGIN_FALLIDO') return throwError(() => new Error('LOGIN_FALLIDO'));

        if (error.networkError) {
          if (navigator.onLine) return throwError(() => new Error('SERVER_ERROR'));
          else return throwError(() => new Error('NO_CONNECTION'));
        }

        return throwError(() => new Error('LOGIN_FALLIDO'));
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

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const decoded: any = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp < now;
    } catch (e) {
      return true;
    }
  }
}

