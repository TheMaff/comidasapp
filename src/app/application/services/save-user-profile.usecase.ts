import { Injectable, inject } from '@angular/core';
import { USER_REPOSITORY } from '../../core/tokens';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserProfile } from '../../domain/entities/user-profile';

@Injectable({ providedIn: 'root' })
export class SaveUserProfile {
    private repo = inject<UserRepository>(USER_REPOSITORY);
    async execute(profile: UserProfile) {
        if (!profile.uid || !profile.members?.length) throw new Error('Perfil inválido');
        await this.repo.upsert(profile);
    }
}
