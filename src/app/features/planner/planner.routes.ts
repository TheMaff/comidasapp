import { Routes } from '@angular/router';
import { PlannerCalendarComponent } from './pages/planner-calendar/planner-calendar.component';
import { PlannerDayDetailComponent } from './pages/planner-day-detail/planner-day-detail.component';
import { PlannerFormComponent } from './pages/planner-form/planner-form.component';

export const PLANNER_ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'calendar',
        pathMatch: 'full'
    },
    {
        path: 'calendar',
        component: PlannerCalendarComponent
    },
    {
        path: 'day/:date',
        component: PlannerDayDetailComponent
    },
    {
        path: 'settings', // Asumiendo que PlannerForm es para config/generación
        component: PlannerFormComponent
    }
];

export default PLANNER_ROUTES;