import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { CREATE_USER, FIND_ALL_ROLES, FIND_ALL_USERS, REMOVE_USER, UPDATE_USER} from '../graphql';
import { Rol, UserGraphQL } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apollo: Apollo) { }

  getAllUsers(): Observable<UserGraphQL[]> {
    return this.apollo.watchQuery<{ findAllUsers: UserGraphQL[] }>({
      query: FIND_ALL_USERS,
      fetchPolicy: 'network-only'
    }).valueChanges.pipe(
      map(result => result.data.findAllUsers),
      catchError(() => throwError(() => new Error('ERROR_USERS')))
    );
  }

  getAllRoles(): Observable<Rol[]> {
    return this.apollo.watchQuery<{ findAllRoles: Rol[] }>({
      query: FIND_ALL_ROLES,
      fetchPolicy: 'network-only'
    }).valueChanges.pipe(
      map(result => result.data.findAllRoles),
      catchError(() => throwError(() => new Error('ERROR_ROLES')))
    );
  }


  createUser(input: any): Observable<UserGraphQL> {
    return this.apollo.mutate<{ createUser: UserGraphQL }>({
      mutation: CREATE_USER,
      variables: {
        createUserInput: input
      }
    }).pipe(
      map(result => result.data!.createUser),
      catchError(() => throwError(() => new Error('ERROR_CREATE_USER')))
    );
  }

  updateUser(input: any): Observable<UserGraphQL> {
    return this.apollo.mutate<{ UpdateUser: UserGraphQL }>({
      mutation: UPDATE_USER,
      variables: {
        updateUserInput: input
      }
    }).pipe(
      map(result => result.data!.UpdateUser),
      catchError(() => throwError(() => new Error('ERROR_UPDATE_USER')))
    );
  }

  deleteUser(id: number): Observable<UserGraphQL> {
    return this.apollo.mutate<{ removeUser: UserGraphQL }>({
      mutation: REMOVE_USER,
      variables: { removeUserId: id }
    }).pipe(
      map(result => result.data!.removeUser),
      catchError(() => throwError(() => new Error('ERROR_DELETE_USER')))
    );
  }
}
