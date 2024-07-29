import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, OnInit } from '@angular/core';
import { IonModal,IonTextarea, IonTitle, IonItem, IonContent, IonInput, IonButton, IonButtons, IonToolbar, IonHeader, ModalController, IonText, IonCard, IonCardContent, IonCardTitle, IonCardHeader, ToastController, AlertController } from '@ionic/angular/standalone';
import { IMarker } from '../../models/IMarker';
import { addIcons } from 'ionicons';
import { cameraOutline, close, saveOutline, trash } from 'ionicons/icons';
import { NgIf } from '@angular/common';
import { Geolocation, Position } from '@capacitor/geolocation';
import { FormsModule } from '@angular/forms';
import { MarkersService } from '../../services/markers/markers.service';
import { ModalRoles } from '../../models/ModalRoles';
import { Photo } from '@capacitor/camera';
import { PhotosService } from '../../services/photos/photos.service';
import { Auth } from '@angular/fire/auth';


@Component({
  selector: 'app-marker-modal',
  templateUrl: './marker-modal.component.html',
  styleUrls: ['./marker-modal.component.scss'],
  standalone: true,
  imports: [IonTitle, IonModal, IonItem, IonContent, IonButton, IonButtons, IonToolbar, IonHeader, IonText, IonCard, IonCardContent, IonCardHeader,IonCardTitle, NgIf, FormsModule, IonInput, IonTextarea],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class MarkerModalComponent  implements OnInit {
  @Input() marker: IMarker | undefined;

  coordinates: Position | undefined;
  snippetTextArea: string = '';
  titleTextArea: string = '';
  photo: Photo | undefined;
  allowDelete: boolean = false;

  titleMinlength: number = 10;
  descriptionMinLength: number = 50;
  photoURLMinLength: number = 15;
  
  constructor(
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private markersService: MarkersService,
    private alertController: AlertController,
    private photoService: PhotosService,
    private auth: Auth) { 
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
    else {
      this.allowDelete = this.marker.userId === this.auth.currentUser?.uid;
    }
  }

  close(){
    this.modalCtrl.dismiss();
  }

  customCounterFormatter(inputLength: number, maxLength: number) {
    return `${maxLength - inputLength} caràcters restants`;
  }

  async openCamera(){
    this.photo =  await this.photoService.takePhoto();    
  }

  async saveMarker(){
    try {
      this.coordinates = await Geolocation.getCurrentPosition();

      let marker : IMarker = {
        id: '',
        userId: this.auth.currentUser!.uid,
        photoURL: '',
        title: this.titleTextArea,
        snippet: this.snippetTextArea,
        coordinate: {
          lat: this.coordinates.coords.latitude,
          lng: this.coordinates.coords.longitude,
        }
      }

      marker.photoURL = await this.photoService.uploadPhoto(this.photo!) || '';

      if(await this.validateNewMarkerValues(marker)){
        let markerAdded = await this.markersService.addMarker(marker);
        marker.id = markerAdded.id;

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
      this.presentToast("La imatge no s'ha pujat correctament");
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
          await this.photoService.deletePhoto(equalMarker.photoURL);
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
