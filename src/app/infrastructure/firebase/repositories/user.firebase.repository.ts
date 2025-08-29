import { inject } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { UserProfile } from '../../../domain/entities/user-profile';

export class UserFirebaseRepository implements UserRepository {
    private fs = inject(Firestore);

    async get(uid: string): Promise<UserProfile | null> {
        const snap = await getDoc(doc(this.fs, `users/${uid}`));
        return snap.exists() ? (snap.data() as UserProfile) : null;
    }
    async upsert(profile: UserProfile): Promise<void> {
        await setDoc(doc(this.fs, `users/${profile.uid}`), profile, { merge: true });
    }
}
