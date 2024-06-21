import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonNote, IonButton } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonButton, IonNote, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule]
})
export class LoginPage implements OnInit {
	credentials!: FormGroup;

	constructor(
		private fb: FormBuilder,
		private authService: AuthService,
		private router: Router
	) {}

	ngOnInit() {
		this.credentials = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(6)]]
		});
	}

	async register() {

    console.log('registreing')

		const user = await this.authService.register(this.credentials.value);

    console.log('registred')

		if (user) {
			this.router.navigateByUrl('/', { replaceUrl: true });
		} else {
			console.log('Registration failed', 'Please try again!');
		}
	}

	async login() {

		const user = await this.authService.login(this.credentials.value);

		if (user) {
			this.router.navigateByUrl('/', { replaceUrl: true });
		} else {
			console.log('Login failed', 'Please try again!');
		}
	}

}