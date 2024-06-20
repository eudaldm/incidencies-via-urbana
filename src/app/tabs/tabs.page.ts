import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {menuOutline, locationOutline, personOutline, layersOutline} from 'ionicons/icons';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss'],
    standalone: true,
    imports: [IonicModule]
})
export class TabsPage {

  constructor() {
    addIcons({
      menuOutline, locationOutline, personOutline, layersOutline
    });
  }

}
