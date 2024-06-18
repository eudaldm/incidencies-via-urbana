import { Injectable } from '@angular/core';
import { Marker } from '@capacitor/google-maps';
import { MarkersDataService } from '../firestoreData/markers-data.service';
import { IMarker } from 'src/app/models/IMarker';

@Injectable({
  providedIn: 'root'
})
export class MarkersService {

  latLngDif = 0.01;

  constructor(private markersDataService: MarkersDataService) { }

  getNearMarkers(latitude: number, longitude: number): Promise<Marker[]> {
    return this.markersDataService.getNearMarkers(latitude, longitude);
  }

  private getMockedMarkers(latitude: number, longitude: number) : IMarker[]
  {
    let markers: IMarker[] = [];

    for (let i = 0; i < 7; i++) {
       markers.push({
        userId: 'userTest',
        title: 'marker ' + i,
        snippet: 'snippet ' + i,
          coordinate: {
            lat: Math.random() * ((latitude + this.latLngDif) -  (latitude - this.latLngDif)) + (latitude - this.latLngDif),
            lng: Math.random() * ((longitude + this.latLngDif) -  (longitude - this.latLngDif)) + (longitude - this.latLngDif),
          }
        })
    }

    return markers;
  }

}
