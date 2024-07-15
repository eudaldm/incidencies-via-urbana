import { Component } from '@angular/core';
import { IonIcon, IonTabBar, IonTabButton, IonTabs, Platform } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {menuOutline, locationOutline, personOutline, layersOutline} from 'ionicons/icons';
import OneSignal from 'onesignal-cordova-plugin';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss'],
    standalone: true,
    imports: [IonTabs, IonTabBar, IonTabButton, IonIcon]
})
export class TabsPage {

  constructor(private platform: Platform, private authService: AuthService) {
    addIcons({
      menuOutline, locationOutline, personOutline, layersOutline
    });

    // Check if the app is running on a mobile device to turn on OneSignal push notifications
    if(this.platform.is('mobile')) {
      // Remove this method to stop OneSignal Debugging
      OneSignal.Debug.setLogLevel(6);
      
      // Replace YOUR_ONESIGNAL_APP_ID with your OneSignal App ID
      OneSignal.initialize("b0283ed4-860b-4c3b-adc2-69410c7a1c04");

      OneSignal.Notifications.addEventListener('click', async (e) => {
        let clickData = await e.notification;
        console.log("Notification Clicked : " + clickData);
      });

      OneSignal.Notifications.requestPermission(true).then((success: Boolean) => {
        console.log("Notification permission granted " + success);
      });

      // Store the user's email as external_id to help us identify the subscription
      OneSignal.login(authService.getCurrentUserEmail());
    }
  }

}
