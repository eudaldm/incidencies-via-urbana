import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { GoogleMap, MapType } from '@capacitor/google-maps';
import { environment } from 'src/environments/environment';
import { Geolocation } from '@capacitor/geolocation';
import { MarkersService } from '../../services/markers/markers.service';
import { IonicModule, ModalController } from '@ionic/angular';
import { MarkerModalComponent } from '../../components/marker-modal/marker-modal.component';
import { MarkerClickCallbackData } from '@capacitor/google-maps/dist/typings/definitions';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, MarkerModalComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Tab2Page {

  newMap: GoogleMap | undefined;
  mapRef = document.getElementById('map');

  constructor(private markersService: MarkersService, private modalCtrl: ModalController) { }

  ionViewDidEnter() {
    if (this.newMap === undefined) {
      this.createMap();
    }
  }

  async createMap() {

    let coordinates = await Geolocation.getCurrentPosition();
    this.mapRef = document.getElementById('map');

    if (this.mapRef) {
      this.newMap = await GoogleMap.create({
        id: 'my-cool-map',
        element: this.mapRef,
        apiKey: environment.firebase.apiKey,
        config: {
          center: {
            lat: coordinates.coords.latitude,
            lng: coordinates.coords.longitude,
          },
          zoom: 17,
        },
      });

      this.newMap.enableTouch();
      this.newMap.enableCurrentLocation(true);
      this.newMap.enableAccessibilityElements(true);
      this.newMap.enableIndoorMaps(false);
      this.newMap.enableTrafficLayer(false);

      this.newMap.setOnMarkerClickListener(async (marker) => {
        this.newMap?.setCamera(
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

      this.newMap.addMarkers(await this.markersService.getNearMarkers(coordinates.coords.latitude, coordinates.coords.longitude));
    }
  }

  async changeLayer() {

    if (this.newMap) {

      let mapType = await this.newMap.getMapType();

      this.newMap.setMapType(
        mapType === MapType.Normal ?
          MapType.Satellite :
          MapType.Normal
      );
    }
  };

  async openModal(marker: MarkerClickCallbackData) {

    const modal = await this.modalCtrl.create({
      component: MarkerModalComponent,
      componentProps: { title: marker.title },
    });

    modal.present();

    // const { data, role } = await modal.onWillDismiss();

    // if (role === 'confirm') {
    //   this.message = `Hello, ${data}!`;
    // }
  }
}
