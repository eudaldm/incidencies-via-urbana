import { Component } from '@angular/core';
import { IonIcon, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {menuOutline, locationOutline, personOutline, layersOutline} from 'ionicons/icons';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss'],
    standalone: true,
    imports: [IonTabs, IonTabBar, IonTabButton, IonIcon]
})
export class TabsPage {

  constructor() {
    addIcons({
      menuOutline, locationOutline, personOutline, layersOutline
    });
  }

}
