import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlannerRoutingModule } from './planner-routing.module';
import { PlannerComponent } from './planner.component';
import { PlannerFormComponent } from './pages/planner-form/planner-form.component';
import { PlannerCalendarComponent } from './pages/planner-calendar/planner-calendar.component';
import { PlannerDayDetailComponent } from './pages/planner-day-detail/planner-day-detail.component';
import { DayCardComponent } from './components/day-card/day-card.component';
import { ReactiveFormsModule } from '@angular/forms';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [
    PlannerComponent,
    PlannerFormComponent,
    PlannerCalendarComponent,
    PlannerDayDetailComponent,
    DayCardComponent
  ],
  imports: [
    CommonModule,
    PlannerRoutingModule,
    ReactiveFormsModule,
    PlannerRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatSelectModule
  ]
})
export class PlannerModule { }
