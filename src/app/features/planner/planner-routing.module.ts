import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlannerFormComponent } from './pages/planner-form/planner-form.component';
import { PlannerCalendarComponent } from './pages/planner-calendar/planner-calendar.component';
import { PlannerDayDetailComponent } from './pages/planner-day-detail/planner-day-detail.component';

const routes: Routes = [
  { path: '', component: PlannerFormComponent },              // /planner
  { path: 'calendar', component: PlannerCalendarComponent },  // /planner/calendar
  { path: 'day/:date', component: PlannerDayDetailComponent } // /planner/day/2025-09-15
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlannerRoutingModule { }
