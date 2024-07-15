import { Injectable } from '@angular/core';
import { Auth, AuthError, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) {}

  async register({ email, password }: {email: string; password: string}) {
    try {
      const user = await createUserWithEmailAndPassword(this.auth, email, password);
      return user;
    } catch (e) {
      return (e as AuthError).code;
    }
  }

  async login({ email, password }: {email: string; password: string}) {
    try {
      const user = await signInWithEmailAndPassword(this.auth, email, password);
      return user;
    } catch (e) {      
      return (e as AuthError).code;
    }
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  getCurrentUserEmail() {
    return this.auth.currentUser ? String(this.auth.currentUser.email) : "";
  }

  logout() {
    return signOut(this.auth);
  }
}



