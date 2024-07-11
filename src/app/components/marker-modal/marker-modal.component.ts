import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, OnInit } from '@angular/core';
import { IonModal, IonTitle, IonItem, IonContent, IonButton, IonButtons, IonToolbar, IonHeader, ModalController, IonText, IonCard, IonCardContent, IonCardTitle, IonCardHeader  } from '@ionic/angular/standalone';
import { IMarker } from '../../models/IMarker';
import { addIcons } from 'ionicons';
import { cameraOutline, close, saveOutline } from 'ionicons/icons';
import { NgIf } from '@angular/common';
import { Geolocation, Position } from '@capacitor/geolocation';

@Component({
  selector: 'app-marker-modal',
  templateUrl: './marker-modal.component.html',
  styleUrls: ['./marker-modal.component.scss'],
  standalone: true,
  imports: [IonTitle, IonModal, IonItem, IonContent, IonButton, IonButtons, IonToolbar, IonHeader, IonText, IonCard, IonCardContent, IonCardHeader,IonCardTitle, NgIf],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class MarkerModalComponent  implements OnInit {

  @Input() marker: IMarker | undefined;

  coordinates: Position | undefined;
  
  constructor(private modalCtrl: ModalController) { 
    addIcons({
      close,
      cameraOutline,
      saveOutline
    });
  }

  async ngOnInit() {
    if (this.marker === undefined){
      this.coordinates = await Geolocation.getCurrentPosition();
    }
  }

  close(){
    this.modalCtrl.dismiss();
  }

  customCounterFormatter(inputLength: number, maxLength: number) {
    return `${maxLength - inputLength} caràcters restants`;
  }

  openCamera(){

  }

  saveMarker(){}

}
