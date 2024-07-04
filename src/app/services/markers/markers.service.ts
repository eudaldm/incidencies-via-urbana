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

  getNearMarkers(latitude: number, longitude: number): Promise<IMarker[]> {
    return this.markersDataService.getNearMarkers(latitude, longitude);
    //return this.getMockedMarkers(latitude, longitude);
  }

  private async getMockedMarkers(latitude: number, longitude: number) : Promise<IMarker[]>
  {
    let markers: IMarker[] = [];

    for (let i = 0; i < 7; i++) {
       markers.push({
        id: ''+i,
        userId: 'userTest',
        photoURL: 'https://s2.ppllstatics.com/elcomercio/www/multimedia/202301/21/media/cortadas/80120341--1248x968.jpg',
        title: 'marker ' + i,
        snippet: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen boo baallon. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500 when an unknown printer took a galley of type and scrambled it to make a type specimen boo baallon.',
          coordinate: {
            lat: Math.random() * ((latitude + this.latLngDif) -  (latitude - this.latLngDif)) + (latitude - this.latLngDif),
            lng: Math.random() * ((longitude + this.latLngDif) -  (longitude - this.latLngDif)) + (longitude - this.latLngDif),
          }
        })
    }

    return markers;
  }

}
