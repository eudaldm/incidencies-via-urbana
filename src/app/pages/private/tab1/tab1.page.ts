import { Component } from '@angular/core';
import { MarkersService } from '../../../services/markers/markers.service';
import { Geolocation } from '@capacitor/geolocation';
import { Marker } from '@capacitor/google-maps';
import { NgFor } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonImg, IonAvatar, IonItem, IonLabel, IonList } from '@ionic/angular/standalone';

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss'],
    standalone: true,
    imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonImg, IonItem, IonAvatar, IonLabel, NgFor]
})
export class Tab1Page {

  markers: Marker[] = [];

  constructor(public markersService: MarkersService) {}

  ionViewDidEnter() {
    this.GetMarkers();
  }

  async GetMarkers(){
    let coordinates = await Geolocation.getCurrentPosition();
    this.markers = await this.markersService.getNearMarkers(coordinates.coords.latitude, coordinates.coords.longitude)
  }


}
