import { Injectable } from '@angular/core';
import { Marker } from '@capacitor/google-maps';

@Injectable({
  providedIn: 'root'
})
export class MarkersService {

  latLngDif = 0.01;

  constructor() { }

  getNearMarkers(latitude: number, longitude: number): Marker[] {
    return this.getMockedMarkers(latitude, longitude);
  }

  private getMockedMarkers(latitude: number, longitude: number) : Marker[]
  {
    let markers: Marker[] = [];

    for (let i = 0; i < 7; i++) {
       markers.push({
        title: 'marker ' + i,
        snippet: 'snippet ' + i,
          coordinate: {
            lat: Math.random() * ((latitude + this.latLngDif) -  (latitude - this.latLngDif)) + (latitude - this.latLngDif),
            lng: Math.random() * ((longitude + this.latLngDif) -  (longitude - this.latLngDif)) + (longitude - this.latLngDif),
          }
        })
    }

    console.log(latitude + " " + longitude);
    console.log(markers);

    return markers;
  }

}
