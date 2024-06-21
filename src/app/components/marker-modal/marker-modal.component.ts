import { Component, Input, OnInit } from '@angular/core';
import { IonModal, IonTitle, IonItem, IonContent, IonButton, IonButtons, IonToolbar, IonHeader, ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-marker-modal',
  templateUrl: './marker-modal.component.html',
  styleUrls: ['./marker-modal.component.scss'],
  standalone: true,
  imports: [IonTitle, IonModal, IonItem, IonContent, IonButton, IonButtons, IonToolbar, IonHeader]
})

export class MarkerModalComponent  implements OnInit {

  @Input() title!: string;
  @Input() snippet!: string;
  
  constructor(private modalCtrl: ModalController) { 
  }

  ngOnInit() {
    console.log(this.title)
    if (this.title === undefined){
      this.title = 'asdasdas';
    }
  }

}
