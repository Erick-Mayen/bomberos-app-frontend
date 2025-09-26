import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { CREATE_VEHICLE, FIND_ALL_VEHICLE_STATES, FIND_ALL_VEHICLE_TYPES, FIND_ALL_VEHICLES, FIND_ONE_VEHICLE, REMOVE_VEHICLE, UPDATE_VEHICLE } from '../graphql';
import { Vehicle, VehicleState, VehicleType } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  constructor(private apollo: Apollo) { }

  getAllVehicles(): Observable<Vehicle[]> {
    return this.apollo.watchQuery<{ findAllVehicles: Vehicle[] }>({
      query: FIND_ALL_VEHICLES,
      fetchPolicy: 'network-only'
    }).valueChanges.pipe(
      map(result => result.data.findAllVehicles),
      catchError(() => throwError(() => new Error('ERROR_VEHICLE')))
    );
  }

   getVehicleById(id: number): Observable<Vehicle> {
    return this.apollo
      .watchQuery<{ findOneVehicle: Vehicle }>({
        query: FIND_ONE_VEHICLE,
        variables: { findOneUserId: id },
        fetchPolicy: 'network-only'
      })
      .valueChanges.pipe(
        map(result => result.data.findOneVehicle)
      );
  }

  getAllVehicleTypes(): Observable<VehicleType[]> {
    return this.apollo.watchQuery<{ findAllVehicleTypes: VehicleType[] }>({
      query: FIND_ALL_VEHICLE_TYPES,
      fetchPolicy: 'network-only'
    }).valueChanges.pipe(
      map(result => result.data.findAllVehicleTypes),
      catchError(() => throwError(() => new Error('ERROR_TYPES')))
    );
  }

  getAllVehicleStates(): Observable<VehicleState[]> {
    return this.apollo.watchQuery<{ findAllVehicleStates: VehicleState[] }>({
      query: FIND_ALL_VEHICLE_STATES,
      fetchPolicy: 'network-only'
    }).valueChanges.pipe(
      map(result => result.data.findAllVehicleStates),
      catchError(() => throwError(() => new Error('ERROR_STATES')))
    );
  }


  createVehicle(input: any): Observable<Vehicle> {
    return this.apollo.mutate<{ createVehicle: Vehicle }>({
      mutation: CREATE_VEHICLE,
      variables: {
        createVehicleInput: input
      }
    }).pipe(
      map(result => result.data!.createVehicle),
      catchError(() => throwError(() => new Error('ERROR_CREATE_VEHICLE')))
    );
  }

  updateVehicle(input: any): Observable<Vehicle> {
    return this.apollo.mutate<{ updateVehicle: Vehicle }>({
      mutation: UPDATE_VEHICLE,
      variables: {
        updateVehicleInput: input
      }
    }).pipe(
      map(result => result.data!.updateVehicle),
      catchError(() => throwError(() => new Error('ERROR_UPDATE_VEHICLE')))
    );
  }

  deleteVehicle(id: number): Observable<Vehicle> {
    return this.apollo.mutate<{ removeVehicle: Vehicle }>({
      mutation: REMOVE_VEHICLE,
      variables: { removeVehicleId: id }
    }).pipe(
      map(result => result.data!.removeVehicle),
      catchError(() => throwError(() => new Error('ERROR_DELETE_VEHICLE')))
    );
  }
}
