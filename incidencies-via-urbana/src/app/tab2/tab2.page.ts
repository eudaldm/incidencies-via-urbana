import { Component } from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  newMap: GoogleMap | undefined;
  mapRef = document.getElementById('map');

  constructor() {

  }

  async ngOnInit() {
    this.mapRef = document.getElementById('map');
    if(this.mapRef){
      this.newMap = await GoogleMap.create({
        id: 'my-cool-map',
        element: this.mapRef,
        apiKey: environment.apiKey,
        config: {
          center: {
            lat: 33.6,
            lng: -117.9,
          },
          zoom: 8,
        },
      });
    }
  }
  
}


