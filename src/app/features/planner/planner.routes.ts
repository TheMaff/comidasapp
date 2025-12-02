import { Routes, Router } from '@angular/router';
import { inject, Component, OnInit } from '@angular/core';
import { PlannerCalendarComponent } from './pages/planner-calendar/planner-calendar.component';
import { PlannerDayDetailComponent } from './pages/planner-day-detail/planner-day-detail.component';
import { PlannerFormComponent } from './pages/planner-form/planner-form.component';
import { MEAL_PLAN_REPOSITORY } from 'src/app/core/tokens';
import { AuthService } from 'src/app/services/auth.service';
import { firstValueFrom } from 'rxjs';

// Componente "Dispatcher" para decidir a dónde ir
@Component({
  template: '<div class="p-10 text-center text-gray-500">Cargando tu plan...</div>',
  standalone: true
})
export class PlannerDispatcherComponent implements OnInit {
  private router = inject(Router);
  private planRepo = inject(MEAL_PLAN_REPOSITORY); // Asegúrate de tener este token
  private auth = inject(AuthService);

  async ngOnInit() {
    try {
      const user = await firstValueFrom(this.auth.user$);
      if (!user) return;

      // Buscamos el último plan activo
      const activePlan = await this.planRepo.findActivePlan(user.uid);
      const today = new Date().toISOString().slice(0, 10);

      if (activePlan) {
        // REGLA 1: Vencimiento
        // Si el plan existe, pero su fecha fin es menor a hoy (ayer fue el último día)
        // Entonces YA NO es un plan activo para editar. Es historial.
        if (activePlan.endDate < today) {
          console.log('El último plan ha vencido. Redirigiendo a crear uno nuevo.');
          this.router.navigate(['/planner/settings']);
          return;
        }

        // Si el plan es válido (termina hoy o en el futuro), vamos al calendario
        // Calculamos los días para la URL
        const daysDiff = Math.ceil((new Date(activePlan.endDate).getTime() - new Date(activePlan.startDate).getTime()) / (1000 * 3600 * 24)) + 1;

        this.router.navigate(['/planner/calendar'], {
          queryParams: { start: activePlan.startDate, days: daysDiff }
        });
      } else {
        // No hay plan, vamos a crear uno
        this.router.navigate(['/planner/settings']);
      }

    } catch (e) {
      this.router.navigate(['/planner/settings']);
    }
  }
}

export const PLANNER_ROUTES: Routes = [
    {
        path: '',
        // Usamos el dispatcher en lugar de redirigir directo
        // component: PlannerDispatcherComponent 
        // Por ahora mantenemos el redirect a calendar para que el calendar decida
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