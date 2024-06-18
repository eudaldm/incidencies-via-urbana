import { Injectable } from '@angular/core';
import { FirestoreDataService } from './firestore-data.service';
import { Firestore, and, collection, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { IMarker } from 'src/app/models/IMarker';

@Injectable({
  providedIn: 'root'
})

export class MarkersDataService extends FirestoreDataService {

  latLngDif = 0.01;

  constructor(firestore: Firestore) {
    super(firestore);
    this.collectionName = 'markers';
  }

  getAllMarkers(): Observable<IMarker[]> {
    return this.getAll<IMarker>();
  }

  getMarkerById(id: string): Observable<IMarker> {
    return this.getById<IMarker>(id);
  }

  addMarker(markerToAdd: IMarker) {
    return this.add<IMarker>(markerToAdd);
  }

  getNearMarkers(latitude: number, longitude: number): Promise<IMarker[]> {
    const filter = query(collection(this.firestore, this.collectionName), and(
      where("coordinate.lat", "<=", latitude + this.latLngDif),
      where("coordinate.lat", ">=", latitude - this.latLngDif),
      where("coordinate.lng", "<=", longitude + this.latLngDif),
      where("coordinate.lng", ">=", longitude - this.latLngDif)
    ));

    console.log(latitude, longitude)

    return this.getByQuery<IMarker>(filter);
  }

}
