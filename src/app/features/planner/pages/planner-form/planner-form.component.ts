import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';

// Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

// Dominio
import { ProposeMealPlan } from '../../../../application/services/propose-meal-plan.usecase';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-planner-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './planner-form.component.html'
})
export class PlannerFormComponent {
  private fb = inject(FormBuilder);
  private propose = inject(ProposeMealPlan);
  private auth = inject(AuthService);
  private router = inject(Router);

  // Signal para loading state
  processing = signal(false);

  // Fecha mínima: Hoy (para no planificar el pasado por error)
  minDate = new Date();

  form = this.fb.group({
    startDate: [new Date(), Validators.required],
    days: [7, [Validators.required, Validators.min(1), Validators.max(30)]]
  });

  async next() {
    if (this.form.invalid) return;

    this.processing.set(true);
    try {
      const start = this.form.value.startDate as Date;
      const days = this.form.value.days as number;

      // Convertir a ISO String (YYYY-MM-DD) asegurando UTC local
      // Truco: Usar sv-SE locale da formato ISO YYYY-MM-DD directo
      const startISO = start.toLocaleDateString('sv-SE');

      // Calcular End Date
      const endISOObj = new Date(start);
      endISOObj.setDate(endISOObj.getDate() + (days - 1));
      const endISO = endISOObj.toLocaleDateString('sv-SE');

      const uid = (await firstValueFrom(this.auth.user$))?.uid;

      if (uid) {
        // Generar propuesta (si no existe)
        await this.propose.execute(uid, startISO, endISO);

        // Navegar al calendario
        this.router.navigate(['/planner/calendar'], {
          queryParams: { start: startISO, days }
        });
      }
    } catch (error) {
      console.error('Error generando plan:', error);
    } finally {
      this.processing.set(false);
    }
  }
}