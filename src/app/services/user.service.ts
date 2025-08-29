// user.service.ts
import { Injectable, inject } from '@angular/core';
import { Firestore, doc, setDoc, getDoc, serverTimestamp } from '@angular/fire/firestore';
import { User } from 'firebase/auth';

@Injectable({ providedIn: 'root' })
export class UserService {
    private fs = inject(Firestore);

    async ensureProfile(u: User) {
        const ref = doc(this.fs, `users/${u.uid}`);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
            await setDoc(ref, {
                uid: u.uid,
                displayName: u.displayName ?? null,
                email: u.email ?? null,
                photoURL: u.photoURL ?? null,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
        } else {
            await setDoc(ref, {
                displayName: u.displayName ?? null,
                // email: u.email ?? null,
                photoURL: u.photoURL ?? null,
                updatedAt: serverTimestamp()
            }, { merge: true });
        }
    }
}
