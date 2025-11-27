import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, from, of } from 'rxjs';
import { switchMap, map, tap, filter, catchError } from 'rxjs/operators';

// Capas de Dominio y Aplicación
import { GetMealPlanByRange } from 'src/app/application/services/get-meal-plan-by-range.usecase';
import { DISH_REPOSITORY, MEAL_PLAN_REPOSITORY } from 'src/app/core/tokens';
import { DishRepository } from 'src/app/domain/repositories/dish.repository';
import { MealPlanRepository } from 'src/app/domain/repositories/meal-plan.repository';

import { AuthService } from 'src/app/services/auth.service';
import { Dish } from 'src/app/domain/entities/dish';
import { MealPlan } from 'src/app/domain/entities/meal-plan';

// UI Modules
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { DayCardComponent } from '../../components/day-card/day-card.component';

@Component({
  selector: 'app-planner-calendar',
  templateUrl: './planner-calendar.component.html',
  styleUrls: ['./planner-calendar.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    DayCardComponent
  ]
})
export class PlannerCalendarComponent {
  // Inyecciones
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);
  private getPlanUC = inject(GetMealPlanByRange);
  private dishesRepo = inject(DISH_REPOSITORY) as DishRepository;
  private mealPlanRepo = inject(MEAL_PLAN_REPOSITORY) as MealPlanRepository;

  // Estado UI
  loading = signal<boolean>(true);

  // --- REACTIVIDAD ---

  // 1. Creamos un flujo que combine Usuario + Cambios en la URL (Query Params)
  private sources$ = combineLatest([
    this.auth.user$.pipe(filter(u => !!u)), // Esperar usuario
    this.route.queryParams                  // Escuchar cambios de URL
  ]);

  // 2. Transformamos ese flujo en los datos que necesita la vista (ViewModel)
  private dataStream$ = this.sources$.pipe(
    tap(() => this.loading.set(true)),
    switchMap(async ([user, params]) => {
      const uid = user!.uid;

      // 1. Verificar si hay parámetros
      if (!params['start'] || !params['days']) {
        
        // 🚨 MEJORA: Buscar plan activo antes de mandarlo a crear uno nuevo
        const activePlan = await this.mealPlanRepo.findActivePlan(uid);
        
        if (activePlan) {
            // Si existe, redirigimos al calendario CON los parámetros de ese plan
            const daysDiff = (new Date(activePlan.endDate).getTime() - new Date(activePlan.startDate).getTime()) / (1000 * 3600 * 24) + 1;
            this.router.navigate([], { 
                queryParams: { start: activePlan.startDate, days: Math.round(daysDiff) } 
            });
            return null;
        }

        // Si no existe, entonces sí a settings
        this.router.navigate(['/planner/settings']); 
        return null;
      }

      const startStr = params['start'];
      const planDays = +params['days'];

      // 2. Calcular límites del PLAN (Lo que el usuario eligió)
      const planStart = new Date(startStr + 'T00:00:00');
      const planEnd = new Date(planStart);
      planEnd.setDate(planEnd.getDate() + planDays - 1);

      // 3. Calcular límites de la GRILLA (Visual: Lunes -> Domingo)
      const gridStart = this.getMonday(planStart);
      const gridEnd = this.getSunday(planEnd);

      // 4. Generar todas las fechas visuales (incluyendo relleno)
      const gridDates = this.buildDateRange(gridStart, gridEnd);

      // 5. Traer datos (usamos el rango del PLAN para la query a BD)
      const [plan, allDishes] = await Promise.all([
        this.getPlanUC.execute(uid, startStr, planEnd.toISOString().slice(0, 10)),
        this.dishesRepo.listByUser(uid)
      ]);

      const dishesMap = new Map<string, Dish>();
      allDishes.forEach(d => dishesMap.set(d.id, d));

      return {
        plan,
        dishesMap,
        gridDates, // Todas las celdas
        planStartStr: startStr, // Para saber dónde empieza lo editable
        planEndStr: planEnd.toISOString().slice(0, 10),
        currentParams: { start: startStr, days: planDays }
      };
    }),
    tap(() => this.loading.set(false))
  );

  // 3. Convertimos el flujo en una Signal de solo lectura para el Template
  viewData = toSignal(this.dataStream$, { initialValue: null });

  // --- Helpers de Fechas ---

  private getMonday(d: Date): Date {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - ((day + 6) % 7);
    return new Date(date.setDate(diff));
  }

  private getSunday(d: Date): Date {
    const date = new Date(d);
    const day = date.getDay(); // 0 es Domingo
    const diff = date.getDate() + (day === 0 ? 0 : 7 - day);
    return new Date(date.setDate(diff));
  }

  private buildDateRange(start: Date, end: Date): string[] {
    const dates: string[] = [];
    const current = new Date(start);
    while (current <= end) {
      dates.push(current.toISOString().slice(0, 10));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }

  // --- LÓGICA VISUAL ---

  // Método helper para obtener nombre (ahora recibe los datos ya procesados)
  getDishName(dateISO: string, plan: MealPlan | null, map: Map<string, Dish>): string {
    if (!plan) return '—';
    const dishId = plan.getDishIdForDate(dateISO); // ¡Usamos el método de la Entidad Rica!
    if (!dishId) return '—';
    return map.get(dishId)?.name ?? 'Plato no encontrado';
  }

  // Verifica si una fecha está DENTRO del rango planificado
  isInPlan(dateISO: string, startISO: string, endISO: string): boolean {
    return dateISO >= startISO && dateISO <= endISO;
  }

  async openDay(dateISO: string, data: any) {
    // Caso 1: Está dentro del plan -> Navegar al detalle (Ya funciona)
    if (this.isInPlan(dateISO, data.planStartStr, data.planEndStr)) {
      this.router.navigate(['/planner/day', dateISO], {
        queryParams: data.currentParams
      });
      return;
    }

    // Caso 2: Está FUERA del plan (Futuro) -> EXTENDER
    if (dateISO > data.planEndStr) {
      if (confirm(`¿Quieres extender tu plan hasta el ${dateISO}?`)) {
        this.loading.set(true);
        try {
          // 1. Actualizar entidad local
          const plan = data.plan as MealPlan;
          // Asumimos que MealPlan es mutable o tiene método para actualizar fecha fin
          // Si es inmutable, crea una copia o usa un método 'extendTo(date)'

          // 2. Guardar en BD (Solo actualizamos endDate)
          // Necesitamos un método en MealPlan para esto o hacerlo manual
          // await this.savePlanUC.extendPlan(plan, dateISO); 

          // Simplificación: Recargar con nuevos params
          // Calcular nuevos días
          const start = new Date(data.planStartStr);
          const newEnd = new Date(dateISO);
          const newDays = Math.ceil((newEnd.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;

          // Actualizar URL (esto disparará el recálculo y guardado automático si lo configuramos)
          this.router.navigate([], {
            queryParams: { start: data.planStartStr, days: newDays }
          });

          // IMPORTANTE: Tu 'saveMealPlan' actual guarda TODO el objeto. 
          // Al recargar la página con más días, el 'proposePlan' generará los días faltantes
          // y tu lógica de 'guardar si no existe' debe adaptarse para 'actualizar si cambió'.
        } finally {
          this.loading.set(false);
        }
      }
    }
  }
}