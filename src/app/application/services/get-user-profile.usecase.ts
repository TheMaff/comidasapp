import { Injectable, inject } from '@angular/core';
import { USER_REPOSITORY } from '../../core/tokens';
import { UserRepository } from '../../domain/repositories/user.repository';

@Injectable({ providedIn: 'root' })
export class GetUserProfile {
    private repo = inject<UserRepository>(USER_REPOSITORY);
    execute(uid: string) { return this.repo.get(uid); }
}
