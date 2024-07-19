import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { GoogleMap, MapType } from '@capacitor/google-maps';
import { environment } from 'src/environments/environment';
import { Geolocation } from '@capacitor/geolocation';
import { MarkersService } from '../../../services/markers/markers.service';
import { ModalController, Platform, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { MarkerModalComponent } from '../../../components/marker-modal/marker-modal.component';
import { NgIf } from '@angular/common';
import { MarkerClickCallbackData } from '@capacitor/google-maps/dist/typings/definitions';
import { addIcons } from 'ionicons';
import { add, layersOutline } from 'ionicons/icons';
import { IMarker } from '../../../models/IMarker';
import { ModalRoles } from 'src/app/models/ModalRoles';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonIcon, MarkerModalComponent, NgIf ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Tab2Page {

  map: GoogleMap | undefined;
  mapRef = document.getElementById('map');

  isMobile: boolean;

  nearMarkers: IMarker[] = [];

  constructor(
    public markersService: MarkersService,
    public platform: Platform,
    private modalCtrl: ModalController) {

    addIcons({
      layersOutline,
      add
    });

    this.isMobile = this.platform.is('mobile');
  }

  async ionViewDidEnter() {
    if (this.map === undefined) {
      this.createMap();
    }
    else {
      let coordinates = await Geolocation.getCurrentPosition();
      await this.loadNearMarkersToMap(coordinates.coords.latitude, coordinates.coords.longitude);
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

      this.map.setOnMarkerClickListener(async (markerClickData) => {
        this.map?.setCamera(
        {
          coordinate: {
            lat: markerClickData.latitude,
            lng: markerClickData.longitude
          },
          animate: true,
          animationDuration: 500
        });
        
        this.openExistingMarkerModal(markerClickData);
      });

      await this.loadNearMarkersToMap(coordinates.coords.latitude, coordinates.coords.longitude);
    }
  }

  async loadNearMarkersToMap(latitude: number, longitude: number){
    if (this.nearMarkers.length > 0){
      this.map?.removeMarkers([ ...Array(this.nearMarkers.length).keys() ].map( i => i.toString()));
    }

    this.nearMarkers = await this.markersService.getNearMarkers(latitude, longitude);
    this.map?.addMarkers(this.nearMarkers);
  }

  async openExistingMarkerModal(markerClickData: MarkerClickCallbackData) {

    let marker = this.nearMarkers.find(x => 
      x.coordinate.lat === markerClickData.latitude &&
      x.coordinate.lng === markerClickData.longitude &&
      x.title === markerClickData.title);

    const modal = await this.modalCtrl.create({
      component: MarkerModalComponent,
      cssClass: "modal",
      componentProps: { marker: marker },
    });

    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === ModalRoles.Delete) {
      let marker = data as IMarker;

      if(marker.coordinate.lat === markerClickData.latitude &&
        marker.coordinate.lng === markerClickData.longitude &&
        marker.title === markerClickData.title) {
        
        let index = this.nearMarkers.map(m => m.id).indexOf(marker.id);
        if(index > -1){
         this.nearMarkers.splice(index, 1);
         this.map?.removeMarker(markerClickData.markerId);
        }
      }
    }
  }
  
  async changeLayer() {
    if (this.map) {

      let mapType = await this.map.getMapType();

      this.map.setMapType(
        mapType === MapType.Normal ?
          MapType.Satellite :
          MapType.Normal
      );
    }
  }

  async addMarker (){
    const modal = await this.modalCtrl.create({
      component: MarkerModalComponent,
      cssClass: "modal",
      componentProps: { },
    });

    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === ModalRoles.Add) {
      let marker = data as IMarker;
      this.nearMarkers.push(marker);
      this.map?.addMarker(marker);
    }
  }
}

