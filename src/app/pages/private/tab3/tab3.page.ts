import { Component, OnInit } from '@angular/core';
import { ExploreContainerComponent } from '../../../explore-container/explore-container.component';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonLabel, IonItem, IonToggle, IonCard } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss'],
    standalone: true,
    imports: [IonCard, IonToggle, IonItem, IonLabel, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, ExploreContainerComponent]
})
export class Tab3Page implements OnInit {

  isPushNotificationsAllowed!: boolean;
  SubscriptionId!: string

  constructor(private router: Router, private authService: AuthService) {}

  getCurrentUser() {
    return this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.findPushSubscription();
  }

  togglePushNotifications() {
    this.isPushNotificationsAllowed = !this.isPushNotificationsAllowed;
    this.updatePushSubscription();    
  }

  findPushSubscription() {
    const options = {method: 'GET', headers: {accept: 'application/json'}};

    try {
      fetch('https://api.onesignal.com/apps/b0283ed4-860b-4c3b-adc2-69410c7a1c04/users/by/external_id/' + this.authService.getCurrentUserEmail(), options)
        .then(response => response.json())
        .then(response => {
          response.subscriptions.forEach((subscription: { id: string; type: string; enabled: boolean; }) => {
            // Update subscription type checking as devices are integrated into the app
            if (subscription.type == "AndroidPush") {
              this.SubscriptionId = subscription.id;
              this.isPushNotificationsAllowed = subscription.enabled;
            }
          });
        })
        .catch(err => console.error(err));
    } catch (err) {
      console.log(err);
    }
  }

  updatePushSubscription() {
    const options = {
      method: 'PATCH',
      headers: {accept: 'application/json', 'content-type': 'application/json'},
      body: JSON.stringify({subscription: {
          enabled: this.isPushNotificationsAllowed,
          notification_types: this.isPushNotificationsAllowed? 1 : -99
        }
      })
    };
    
    try {
      fetch('https://api.onesignal.com/apps/b0283ed4-860b-4c3b-adc2-69410c7a1c04/subscriptions/' + this.SubscriptionId, options)
        .then(response => response.json())
        .catch(err => console.error(err));
    } catch (err) {
      console.log(err);
    }
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['login']);
    })
  }
}
