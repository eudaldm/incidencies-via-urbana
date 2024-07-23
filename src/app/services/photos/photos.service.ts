import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { getDownloadURL, ref, Storage, uploadString, deleteObject } from '@angular/fire/storage';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class PhotosService {

  constructor(private auth: Auth, private storage: Storage) { }

  async takePhoto(source: CameraSource = CameraSource.Camera): Promise<Photo> {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: source
    });

    return photo;
  }

  async uploadPhoto(photo: Photo) {
    let user = this.auth.currentUser!;
    let date = new Date().getTime();
    let path = `incidencies/${user.uid}/${date}`;
    let storageRef = ref(this.storage, path);

    try {
      await uploadString(storageRef, photo.dataUrl!, 'data_url');
      let photoUrl = await getDownloadURL(storageRef);
      return photoUrl;
    }
    catch (e) {
      return null;
    }
  }

  async deletePhoto(path: string) {
    try{
      let desertRef = ref(this.storage, path);
      await deleteObject(desertRef);
    } catch (error)
    {
    }
  }
}