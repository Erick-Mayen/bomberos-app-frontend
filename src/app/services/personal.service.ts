import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { FIND_ALL_PERSONAL, FIND_ALL_TYPES} from '../graphql';
import { PersonalGraphQL, TypesPersonal } from '../interfaces'

@Injectable({
  providedIn: 'root'
})
export class PersonalService {
  constructor(private apollo: Apollo) {}

  getAllPersonal(): Observable<PersonalGraphQL[]> {
    return this.apollo.watchQuery<{ findAllPersonal: PersonalGraphQL[] }>({
      query: FIND_ALL_PERSONAL
    }).valueChanges.pipe(
      map(result => result.data.findAllPersonal),
      catchError(err => {
        console.error('Error cargando personal:', err);
        return throwError(() => new Error('ERROR_PERSONAL'));
      })
    );
  }

  getAllTypes(): Observable<TypesPersonal[]> {
    return this.apollo.watchQuery<{ findAllTypes: TypesPersonal[] }>({
      query: FIND_ALL_TYPES
    }).valueChanges.pipe(
      map(result => result.data.findAllTypes),
      catchError(err => {
        console.error('Error cargando tipos de personal:', err);
        return throwError(() => new Error('ERROR_TYPES'));
      })
    );
  }
}
