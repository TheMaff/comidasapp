import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { GetUserProfile } from '../../../../application/services/get-user-profile.usecase';
import { SaveUserProfile } from '../../../../application/services/save-user-profile.usecase';
import { AuthService } from '../../../../services/auth.service';
import { firstValueFrom } from 'rxjs';

import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html'
})
export class ProfileFormComponent implements OnInit {
  loading = true;
  form = this.fb.group({
    displayName: [''],
    members: this.fb.array([this.newMember()])
  });
  get members() { return this.form.get('members') as FormArray; }

  constructor(private fb: FormBuilder, private getP: GetUserProfile,
    private saveP: SaveUserProfile, private auth: AuthService) { }

  newMember() {
    return this.fb.group({
      id: [crypto.randomUUID()],
      name: ['', [Validators.required, Validators.minLength(2)]],
      birthDate: ['', Validators.required],
      heightCm: [null],
      weightKg: [null],
      allergies: [''],
      intolerances: [''],
      preferences: ['']
    });
  }
  addMember() { this.members.push(this.newMember()); }
  removeMember(i: number) { this.members.removeAt(i); }

async ngOnInit() {
  try {
    // Espera un usuario válido UNA sola vez
    const user = await firstValueFrom(this.auth.user$.pipe(filter(Boolean), take(1)));
    const uid = user!.uid;

    // Intenta leer el perfil
    const profile = await this.getP.execute(uid);

    if (profile) {
      this.form.patchValue({ displayName: profile.displayName ?? '' });
      this.members.clear();
      for (const m of profile.members) {
        this.members.push(this.fb.group({
          ...m,
          allergies: (m.allergies ?? []).join(', '),
          intolerances: (m.intolerances ?? []).join(', '),
          preferences: (m.preferences ?? []).join(', ')
        }));
      }
    } else {
      // PRIMERA VEZ: deja el formulario inicial listo para completar
      this.form.patchValue({ displayName: user.displayName ?? '' });
      this.members.clear();
      this.members.push(this.newMember());
    }
  } catch (e) {
    console.error('Error cargando perfil', e);
    // Si algo falla, igual mostramos el formulario vacío
    this.members.clear();
    this.members.push(this.newMember());
  } finally {
    this.loading = false; // <- nunca quedamos pegados en "Cargando..."
  }
}


  async save() {
    if (this.form.invalid) return;
    const uid = (await firstValueFrom(this.auth.user$))?.uid!;
    const members = this.members.controls.map(c => {
      const v = c.value as any;
      const split = (s?: string) => (s ?? '').split(',').map(x => x.trim()).filter(Boolean);
      return { ...v, allergies: split(v.allergies), intolerances: split(v.intolerances), preferences: split(v.preferences) };
    });
    await this.saveP.execute({ uid, displayName: this.form.value.displayName ?? '', members });
  }
}
