import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, Platform } from '@ionic/angular/standalone'
import OneSignal from 'onesignal-cordova-plugin';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet]
})
export class AppComponent {
  constructor(private platform: Platform) {
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
    }
  }
}
