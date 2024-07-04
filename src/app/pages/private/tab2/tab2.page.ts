import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { GoogleMap, MapType } from '@capacitor/google-maps';
import { environment } from 'src/environments/environment';
import { Geolocation } from '@capacitor/geolocation';
import { MarkersService } from '../../../services/markers/markers.service';
import { IonicModule, ModalController, Platform } from '@ionic/angular';
import { MarkerModalComponent } from '../../../components/marker-modal/marker-modal.component';
import { NgIf } from '@angular/common';
import { MarkerClickCallbackData } from '@capacitor/google-maps/dist/typings/definitions';
import { addIcons } from 'ionicons';
import { layersOutline } from 'ionicons/icons';

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss'],
    standalone: true,
    imports: [IonicModule, MarkerModalComponent, NgIf],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Tab2Page {

  map: GoogleMap | undefined;
  mapRef = document.getElementById('map');

  isMobile: boolean;

  constructor(
    public markersService: MarkersService, 
    public platform: Platform,
    private modalCtrl: ModalController) {

      addIcons({
        layersOutline
      });

      this.isMobile = this.platform.is('mobile');
    }

  ionViewDidEnter() {
    if(this.map === undefined){
      this.createMap();
    }
  }

  async createMap() {

    let coordinates = await Geolocation.getCurrentPosition();
    this.mapRef = document.getElementById('map');

    if (this.mapRef) {
      this.map = await GoogleMap.create({
        id: 'map',
        element: this.mapRef,
        apiKey: environment.firebase.apiKey,
        config: {
          center: {
            lat: coordinates.coords.latitude,
            lng: coordinates.coords.longitude,
          },
          zoom: 17,
          fullscreenControl: false
        },
      });

      this.map.enableTouch();
      this.map.enableCurrentLocation(true);
      this.map.enableTrafficLayer(false);

      this.map.setOnMarkerClickListener(async (marker) => {
        this.map?.setCamera(
        {
          coordinate: {
            lat: marker.latitude,
            lng: marker.longitude
          },
          animate: true,
          animationDuration: 500
        });

        this.openModal(marker);
        console.log(marker);
      });

      const markers = await this.markersService.getNearMarkers(coordinates.coords.latitude, coordinates.coords.longitude);
      this.map.addMarkers(markers);
    }
  }

  async changeLayer() {

    if(this.map){
      
      let mapType = await this.map.getMapType();

      this.map.setMapType(
        mapType === MapType.Normal ? 
          MapType.Satellite : 
          MapType.Normal
      );
    }
  };

  async openModal(marker: MarkerClickCallbackData) {

    const modal = await this.modalCtrl.create({
      component: MarkerModalComponent,
      cssClass: "modal",
      componentProps: { marker },
    });

    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log('con')
    }
    else {
      console.log('exit')
    }
  }
}

