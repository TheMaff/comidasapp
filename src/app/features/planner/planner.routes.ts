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
      if (!user) return; // AuthGuard lo manejará

      const today = new Date().toISOString().slice(0, 10);
      
      // Buscamos si existe algún plan que incluya HOY o empiece en el FUTURO cercano
      // (Esta lógica depende de tu repositorio, asumamos que buscamos el plan "activo")
      // Nota: Quizás necesites un método nuevo en el repo `findActivePlan(uid, date)`
      // Por ahora, intentemos una lógica simple: buscar un plan que empiece hoy o en los ultimos 7 dias.
      
      // MVP: Si no hay parámetros en la URL, redirigir a 'settings' (comportamiento actual)
      // MEJORA: Implementar búsqueda de plan activo en BD.
      
      this.router.navigate(['/planner/settings']); 

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