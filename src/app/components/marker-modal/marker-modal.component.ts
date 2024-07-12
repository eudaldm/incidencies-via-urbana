import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, OnInit } from '@angular/core';
import { IonModal, IonTitle, IonItem, IonContent, IonButton, IonButtons, IonToolbar, IonHeader, ModalController, IonText, IonCard, IonCardContent, IonCardTitle, IonCardHeader, ToastController, AlertController } from '@ionic/angular/standalone';
import { IMarker } from '../../models/IMarker';
import { addIcons } from 'ionicons';
import { cameraOutline, close, saveOutline, trash } from 'ionicons/icons';
import { NgIf } from '@angular/common';
import { Geolocation, Position } from '@capacitor/geolocation';
import { FormsModule } from '@angular/forms';
import { MarkersService } from '../../services/markers/markers.service';
import { ModalRoles } from '../../models/ModalRoles';


@Component({
  selector: 'app-marker-modal',
  templateUrl: './marker-modal.component.html',
  styleUrls: ['./marker-modal.component.scss'],
  standalone: true,
  imports: [IonTitle, IonModal, IonItem, IonContent, IonButton, IonButtons, IonToolbar, IonHeader, IonText, IonCard, IonCardContent, IonCardHeader,IonCardTitle, NgIf, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class MarkerModalComponent  implements OnInit {
  @Input() marker: IMarker | undefined;

  coordinates: Position | undefined;
  snippetTextArea: string = '';
  titleTextArea: string = '';

  titleMinlength: number = 10;
  descriptionMinLength: number = 50;
  photoURLMinLength: number = 15;
  
  constructor(
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private markersService: MarkersService,
    private alertController: AlertController
  ) { 
    addIcons({
      close,
      cameraOutline,
      saveOutline,
      trash
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

  async saveMarker(){
    try {
      this.coordinates = await Geolocation.getCurrentPosition();

      let marker : IMarker = {
        id: '',
        userId: 'userTest',
        photoURL: 'https://s2.ppllstatics.com/elcomercio/www/multimedia/202301/21/media/cortadas/80120341--1248x968.jpg',
        title: this.titleTextArea,
        snippet: this.snippetTextArea,
        coordinate: {
          lat: this.coordinates.coords.latitude,
          lng: this.coordinates.coords.longitude,
        }
      }

      if(await this.validateNewMarkerValues(marker)){
        await this.markersService.addMarker(marker);
        this.presentToast("S'ha afegit la incidència correctament!", false);
        this.modalCtrl.dismiss(marker, ModalRoles.Add);
      }
    } catch (error) {
      this.presentToast("No s'ha pogut afegir la incidència, torna-ho a intentar!");
    }
  }

  async validateNewMarkerValues(marker : IMarker) : Promise<boolean> {
    if (marker.title?.length === undefined || 
      marker.title?.length < this.titleMinlength){
      this.presentToast('El títol ha de tenir al menys ' + this.titleMinlength + ' caràcters');
      return false;
    }

    if (marker.snippet?.length === undefined || 
      marker.snippet?.length < this.descriptionMinLength){
      this.presentToast('La descripció ha de tenir al menys ' + this.descriptionMinLength + ' caràcters');
      return false;
    }

    if (marker.photoURL?.length === undefined ||
      marker.photoURL?.length < this.photoURLMinLength){
      this.presentToast("La descripció ha de tenir al menys 50 caràcters");
      return false;
    }

    let nearMarkers = await this.markersService.getNearMarkers(marker.coordinate.lat, marker.coordinate.lng);
    let equalMarker = nearMarkers.find(x => 
      x.coordinate.lat === marker.coordinate.lat &&
      x.coordinate.lng ===  marker.coordinate.lng);

    if (equalMarker !== undefined){
      this.presentToast("Ja hi ha una incedència oberta en aquesta localització");
      return false;
    }

    return true;
  }

  async deleteMarker(){
    if (this.marker !== undefined && 
      await this.warn('Confirma que desitja esborrar el marcador?')){

        let nearMarkers = await this.markersService.getNearMarkers(this.marker.coordinate.lat, this.marker.coordinate.lng);
        let equalMarker = nearMarkers.find(x => 
          x.coordinate.lat === this.marker?.coordinate.lat &&
          x.coordinate.lng ===  this.marker?.coordinate.lng &&
          x.title === this.marker?.title);

        if (equalMarker === undefined){
          this.presentToast("No s'ha pogut esborrar la incidència");
        }
        else{
          await this.markersService.deleteMarker(equalMarker);
          this.presentToast("Incidència esborrada!", false);
          this.modalCtrl.dismiss(equalMarker, ModalRoles.Delete);
        }
    }
  }

  async presentToast(message: string, isError: boolean = true, position: 'top' | 'middle' | 'bottom' = 'bottom') {
		const toast = await this.toastController.create({
		  message: message,
		  duration: 3000,
		  position: position,
		  cssClass: isError ? "custom-toast" : "custom-toast-correct"
		});
	
		await toast.present();
  }

  async warn(message: string) {
    return new Promise(async (resolve) => {
      const confirm = await this.alertController.create({
        header: 'Esborrar marcador',
        message: message,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              return resolve(false);
            },
          },
          {
            text: 'Confirmar',
            handler: () => {
              return resolve(true);
            },
          },
        ],
      });

      await confirm.present();
    });
  }
}
