import { UserProfile } from '../entities/user-profile';
export interface UserRepository {
    get(uid: string): Promise<UserProfile | null>;
    upsert(profile: UserProfile): Promise<void>;
}
