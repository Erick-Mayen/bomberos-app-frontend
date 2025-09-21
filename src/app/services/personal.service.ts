import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { CREATE_PERSONAL, FIND_ALL_PERSONAL, FIND_ALL_TYPES, UPDATE_PERSONAL, REMOVE_PERSON } from '../graphql';
import { PersonalGraphQL, TypesPersonal } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class PersonalService {
  constructor(private apollo: Apollo) { }

  getAllPersonal(): Observable<PersonalGraphQL[]> {
    return this.apollo.watchQuery<{ findAllPersonal: PersonalGraphQL[] }>({
      query: FIND_ALL_PERSONAL,
      fetchPolicy: 'network-only'
    }).valueChanges.pipe(
      map(result => result.data.findAllPersonal),
      catchError(() => throwError(() => new Error('ERROR_PERSONAL')))
    );
  }

  getAllTypes(): Observable<TypesPersonal[]> {
    return this.apollo.watchQuery<{ findAllTypes: TypesPersonal[] }>({
      query: FIND_ALL_TYPES,
      fetchPolicy: 'network-only'
    }).valueChanges.pipe(
      map(result => result.data.findAllTypes),
      catchError(() => throwError(() => new Error('ERROR_TYPES')))
    );
  }


  createPersonal(input: any): Observable<PersonalGraphQL> {
    return this.apollo.mutate<{ createPerson: PersonalGraphQL }>({
      mutation: CREATE_PERSONAL,
      variables: {
        createPersonalInput: input
      }
    }).pipe(
      map(result => result.data!.createPerson),
      catchError(() => throwError(() => new Error('ERROR_CREATE_PERSONAL')))
    );
  }

  updatePersonal(input: any): Observable<PersonalGraphQL> {
    return this.apollo.mutate<{ updatePerson: PersonalGraphQL }>({
      mutation: UPDATE_PERSONAL,
      variables: {
        updatePersonalInput: input
      }
    }).pipe(
      map(result => result.data!.updatePerson),
      catchError(() => throwError(() => new Error('ERROR_UPDATE_PERSONAL')))
    );
  }

  deletePersonal(id: number): Observable<PersonalGraphQL> {
    return this.apollo.mutate<{ removePerson: PersonalGraphQL }>({
      mutation: REMOVE_PERSON,
      variables: { removePersonId: id }
    }).pipe(
      map(result => result.data!.removePerson),
      catchError(() => throwError(() => new Error('ERROR_DELETE_PERSONAL')))
    );
  }
}
