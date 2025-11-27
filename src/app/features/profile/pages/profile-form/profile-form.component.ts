import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { filter, take } from 'rxjs/operators';

// Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

// Servicios / Casos de Uso
import { GetUserProfile } from '../../../../application/services/get-user-profile.usecase';
import { SaveUserProfile } from '../../../../application/services/save-user-profile.usecase';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'] // Asegúrate de que el SCSS exista, aunque esté vacío
})
export class ProfileFormComponent implements OnInit {
  // Inyecciones modernas
  private fb = inject(FormBuilder);
  private getP = inject(GetUserProfile);
  private saveP = inject(SaveUserProfile);
  private auth = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  // Estados Reactivos (Signals)
  loading = signal(true);
  saving = signal(false);

  // Formulario (Misma estructura que tenías)
  form = this.fb.group({
    displayName: ['', [Validators.required]],
    budget: [0], // Agregado para soportar el diseño nuevo si quieres, o déjalo opcional
    members: this.fb.array([]) // Iniciamos vacío, se llena en ngOnInit
  });

  get members() { return this.form.get('members') as FormArray; }

  // Helper para crear miembros (Tu lógica original)
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
    this.loading.set(true);
    try {
      // 1. Obtener usuario (Tu lógica original preservada)
      const user = await firstValueFrom(this.auth.user$.pipe(filter(Boolean), take(1)));
      const uid = user!.uid;

      // 2. Obtener perfil
      const profile = await this.getP.execute(uid);

      this.members.clear(); // Limpiar siempre antes de llenar

      if (profile) {
        this.form.patchValue({
          displayName: profile.displayName ?? '',
          // budget: profile.budget // Si tuvieras este campo
        });

        for (const m of profile.members) {
          this.members.push(this.fb.group({
            ...m,
            // Convertir Arrays a String para el Input
            allergies: (m.allergies ?? []).join(', '),
            intolerances: (m.intolerances ?? []).join(', '),
            preferences: (m.preferences ?? []).join(', ')
          }));
        }
      } else {
        // Primera vez
        this.form.patchValue({ displayName: user.displayName ?? '' });
        this.members.push(this.newMember());
      }
    } catch (e) {
      console.error('Error cargando perfil', e);
      this.snackBar.open('Error cargando el perfil', 'Cerrar');
      if (this.members.length === 0) this.members.push(this.newMember());
    } finally {
      this.loading.set(false);
    }
  }

  async save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    try {
      const uid = (await firstValueFrom(this.auth.user$))?.uid!;

      // Transformación de datos (Tu lógica original preservada)
      const membersData = this.members.controls.map(c => {
        const v = c.value as any;
        const split = (s?: string) => (s ?? '').split(',').map(x => x.trim()).filter(Boolean);

        return {
          ...v,
          allergies: split(v.allergies),
          intolerances: split(v.intolerances),
          preferences: split(v.preferences)
        };
      });

      await this.saveP.execute({
        uid,
        displayName: this.form.value.displayName ?? '',
        members: membersData
      });

      this.snackBar.open('Perfil guardado correctamente', 'OK', { duration: 3000 });
    } catch (e) {
      console.error(e);
      this.snackBar.open('Error al guardar', 'Cerrar');
    } finally {
      this.saving.set(false);
    }
  }

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }
}