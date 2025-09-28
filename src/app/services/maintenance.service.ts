import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { CREATE_MAINTENANCE, FIND_ALL_MAINTENANCE, FIND_MAINTENANCE_BY_VEHICLE_ID, FIND_ONE_MAINTENANCE, REMOVE_MAINTENANCE, UPDATE_MAINTENANCE } from '../graphql';
import { VehicleMaintenance } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  constructor(private apollo: Apollo) { }

  getAllVehicleMaintenance(): Observable<VehicleMaintenance[]> {
    return this.apollo.watchQuery<{ findAllMaintenance: VehicleMaintenance[] }>({
      query: FIND_ALL_MAINTENANCE,
      fetchPolicy: 'network-only'
    }).valueChanges.pipe(
      map(result => result.data.findAllMaintenance),
      catchError(() => throwError(() => new Error('ERROR_USERS')))
    );
  }

  getMaintenanceById(id: number): Observable<VehicleMaintenance> {
    return this.apollo
      .watchQuery<{ findOneMaintenance: VehicleMaintenance }>({
        query: FIND_ONE_MAINTENANCE,
        variables: { findOneMaintenanceId: id },
        fetchPolicy: 'network-only'
      })
      .valueChanges.pipe(
        map(result => result.data.findOneMaintenance)
      );
  }


  getMaintenanceByVehicleId(idUnidad: number): Observable<VehicleMaintenance[]> {
    return this.apollo.watchQuery<{ findMaintenanceByVehicleId: VehicleMaintenance[] }>({
      query: FIND_MAINTENANCE_BY_VEHICLE_ID,
      variables: { idUnidad },
      fetchPolicy: 'network-only'
    }).valueChanges.pipe(
      map(result => result.data.findMaintenanceByVehicleId),
      catchError(() => throwError(() => new Error('ERROR_GET_MAINTENANCE_BY_VEHICLE')))
    );
  }

  createMaintenance(input: any): Observable<VehicleMaintenance> {
    return this.apollo.mutate<{ createMaintenance: VehicleMaintenance }>({
      mutation: CREATE_MAINTENANCE,
      variables: { createVehicleMaintenanceInput: input }
    }).pipe(
      map(result => result.data!.createMaintenance),
      catchError(() => throwError(() => new Error('ERROR_CREATE_MAINTENANCE')))
    );
  }

  updateMaintenance(input: any): Observable<VehicleMaintenance> {
    return this.apollo.mutate<{ updateMaintenance: VehicleMaintenance }>({
      mutation: UPDATE_MAINTENANCE,
      variables: { updateVehicleMaintenanceInput: input }
    }).pipe(
      map(result => result.data!.updateMaintenance),
      catchError(() => throwError(() => new Error('ERROR_UPDATE_MAINTENANCE')))
    );
  }

  removeMaintenance(id: number): Observable<VehicleMaintenance> {
    return this.apollo.mutate<{ removeMaintenance: VehicleMaintenance }>({
      mutation: REMOVE_MAINTENANCE,
      variables: { removeMaintenanceId: id }
    }).pipe(
      map(result => result.data!.removeMaintenance),
      catchError(() => throwError(() => new Error('ERROR_REMOVE_MAINTENANCE')))
    );
  }
}



