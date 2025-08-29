export interface FamilyMember {
    id: string;
    name: string;
    birthDate: string;            // ISO
    heightCm?: number;
    weightKg?: number;
    allergies?: string[];
    intolerances?: string[];
    preferences?: string[];       // tags/platos preferidos
}

export interface UserProfile {
    uid: string;
    displayName?: string;
    members: FamilyMember[];      // mínimo 1
}
