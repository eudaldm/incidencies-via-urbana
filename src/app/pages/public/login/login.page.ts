import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonNote, IonButton, IonToast, IonInput, IonCard, IonList, IonItemDivider } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UserCredential } from '@angular/fire/auth';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonCard, IonInput, IonToast, IonButton, IonNote, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule, IonList, IonItemDivider]
})
export class LoginPage implements OnInit {
	credentials!: FormGroup;
	errorMessage!: string;

	constructor(
		private fb: FormBuilder,
		private authService: AuthService,
		private router: Router,
		private toastController: ToastController
	) {}

	ngOnInit() {
		this.credentials = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(6)]]
		});
	}

	async register() {
		if(this.credentials.valid) {
			const response = await this.authService.register(this.credentials.value);
			this.manageResponse(response);
		} else {
			this.manageValidationErrors();
		}
		
	}

	async login() {
		if(this.credentials.valid) {
			const response = await this.authService.login(this.credentials.value);
			this.manageResponse(response);
		} else {
			this.manageValidationErrors();
		}
	}

	private manageResponse(response: string | UserCredential) {
		if (typeof response === "string") {
			this.errorMessage = this.translateToErrorMessage(response);
			this.presentToast("bottom", this.errorMessage);
		} else {
			this.router.navigateByUrl('/', { replaceUrl: true });
		}
	}

	private manageValidationErrors() {
		if (this.credentials.controls['email'].errors) {
			if (this.credentials.controls['email'].errors!['required']) {
				this.presentToast('bottom', "El camp Correu-e és obligatori");
			}
			if (this.credentials.controls['email'].errors!['email']) {
				this.presentToast('bottom', "El Correu-e introduït no és vàlid");
			}
		}
		if (this.credentials.controls['password'].errors) {
			if (this.credentials.controls['password'].errors!['required']) {
				this.presentToast('bottom', "El camp Contrassenya és obligatori");
			}
			if (this.credentials.controls['password'].errors!['minlength']) {
				this.presentToast('bottom', "El camp Contrassenya ha de tenir 6 caràcters com a mínim");
			}
		}
	}

	private translateToErrorMessage(response: string) {
		switch (response) {
			case "auth/invalid-email":
				return "El Correu-e introduït no és vàlid";

			case "auth/missing-password":
				return "Cal introduir una Contrassenya";

			case "auth/invalid-credential":
				return "Les credencials introduïdes son incorrectes";

			case "auth/weak-password":
				return "La Contrassenya introduïda és massa dèbil";

			case "auth/email-already-in-use":
				return "El Correu-e introduït ja està en us"
		
			default:
				return "S'ha produït un error. Contacti amb l'administració del servei";
		}
	}

	async presentToast(position: 'top' | 'middle' | 'bottom', message: string) {
		const toast = await this.toastController.create({
		  message: message,
		  duration: 3000,
		  position: position,
		  cssClass: "custom-toast"
		});
	
		await toast.present();
	  }
}