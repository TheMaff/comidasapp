//auth.service.ts
import { Injectable, inject } from '@angular/core';
import {
    Auth, signInWithPopup, GoogleAuthProvider,
    signInWithEmailAndPassword, createUserWithEmailAndPassword,
    updateProfile, sendPasswordResetEmail,
    authState,
    signOut
} from '@angular/fire/auth';
import { setPersistence, browserLocalPersistence } from 'firebase/auth';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';


@Injectable({
  providedIn: 'root'
})

export class AuthService {

    private auth = inject(Auth);
    user$: Observable<User | null> = authState(this.auth);

    constructor() { }

    // Google
    async loginWithGoogle() {
        await setPersistence(this.auth, browserLocalPersistence);
        return signInWithPopup(this.auth, new GoogleAuthProvider());
    }

    //Emil & Password
    async registerWithEmail(email: string, password: string, displayName?: string) {
        await setPersistence(this.auth, browserLocalPersistence);
        const cred = await createUserWithEmailAndPassword(this.auth, email, password);
        if (displayName) {
            await updateProfile(cred.user, { displayName });
        }
        return cred // { user };
    }
    
    async loginWithEmail(email: string, password: string) {
        await setPersistence(this.auth, browserLocalPersistence);
        return signInWithEmailAndPassword(this.auth, email, password);
    }

    resetPassword(email: string) {
        return sendPasswordResetEmail(this.auth, email);
    }
    
    logout() {
        return signOut(this.auth);
    }
}