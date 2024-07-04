import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, OnInit } from '@angular/core';
import { IonModal, IonTitle, IonItem, IonContent, IonButton, IonButtons, IonToolbar, IonHeader, ModalController } from '@ionic/angular/standalone';
import { IMarker } from '../../models/IMarker';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';

@Component({
  selector: 'app-marker-modal',
  templateUrl: './marker-modal.component.html',
  styleUrls: ['./marker-modal.component.scss'],
  standalone: true,
  imports: [IonTitle, IonModal, IonItem, IonContent, IonButton, IonButtons, IonToolbar, IonHeader],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class MarkerModalComponent  implements OnInit {

  @Input() marker!: IMarker;
  
  constructor(private modalCtrl: ModalController) { 
    addIcons({
      close
    });
  }

  ngOnInit() {
    if (this.marker === undefined){
      
    }
  }

}
