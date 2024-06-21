import { Component } from '@angular/core';
import { ExploreContainerComponent } from '../../../explore-container/explore-container.component';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss'],
    standalone: true,
    imports: [IonicModule, ExploreContainerComponent]
})
export class Tab3Page {

  constructor(private router: Router, private authService: AuthService) {}

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['login']);
    })
  }

}
