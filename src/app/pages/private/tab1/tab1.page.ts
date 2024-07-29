import { Component } from '@angular/core';
import { MarkersService } from '../../../services/markers/markers.service';
import { Geolocation } from '@capacitor/geolocation';
import { NgFor, NgIf } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonImg, IonAvatar, IonItem, IonLabel, IonList, IonText, ModalController } from '@ionic/angular/standalone';
import { MarkerModalComponent } from '../../../components/marker-modal/marker-modal.component';
import { ModalRoles } from '../../../models/ModalRoles';
import { IMarker } from '../../../models/IMarker';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonImg, IonItem, IonAvatar, IonLabel, NgFor, NgIf, IonText]
})
export class Tab1Page {

  markers: IMarker[] = [];

  constructor(public markersService: MarkersService, private modalCtrl: ModalController) { }

  ionViewDidEnter() {
    this.GetMarkers();
  }

  async GetMarkers() {
    let coordinates = await Geolocation.getCurrentPosition();
    this.markers = await this.markersService.getNearMarkers(coordinates.coords.latitude, coordinates.coords.longitude)
  }

  async openExistingMarkerModal(marker: IMarker) {

    const modal = await this.modalCtrl.create({
      component: MarkerModalComponent,
      cssClass: "modal",
      componentProps: { marker: marker },
    });

    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === ModalRoles.Delete) {
      let index = this.markers.indexOf(marker);
      if (index > -1) {
        this.markers.splice(index, 1);
      }
    }
  }
}

