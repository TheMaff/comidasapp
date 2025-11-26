import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ProposeMealPlan } from '../../../../application/services/propose-meal-plan.usecase';
import { AuthService } from '../../../../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-planner-form',
  templateUrl: './planner-form.component.html',
  styleUrls: ['./planner-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule, 
    MatNativeDateModule  
  ]
})
export class PlannerFormComponent {

  form = this.fb.group({
    startDate: [new Date(), Validators.required],
    days: [7, [Validators.required, Validators.min(1), Validators.max(30)]]
  });

  constructor(
    private fb: FormBuilder,
    private propose: ProposeMealPlan,
    private auth: AuthService,
    private router: Router) { }

  async next() {
    if (this.form.invalid) return;
    console.log(this.form.value);

    const start = this.form.value.startDate as Date;
    const days = this.form.value.days as number;
    const startISO = start.toISOString().slice(0, 10);

    const endISO = new Date(start); endISO.setDate(start.getDate() + (days - 1));
    const endStr = endISO.toISOString().slice(0, 10);

    const uid = (await firstValueFrom(this.auth.user$))!.uid;
    
    console.log('{startDate:', startISO, ', days:', days, '}');

    await this.propose.execute(uid, startISO, endStr);
    this.router.navigate(['/planner/calendar'], { queryParams: { start: startISO, days } });
  }

}
