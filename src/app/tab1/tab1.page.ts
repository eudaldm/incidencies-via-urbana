import { Component } from '@angular/core';
import { MarkersService } from '../services/markers/markers.service';
import { Geolocation } from '@capacitor/geolocation';
import { Marker } from '@capacitor/google-maps';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
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
