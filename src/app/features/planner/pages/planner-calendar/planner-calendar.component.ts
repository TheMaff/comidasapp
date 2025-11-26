import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, from, of } from 'rxjs';
import { switchMap, map, tap, filter, catchError } from 'rxjs/operators';

// Capas de Dominio y Aplicación
import { GetMealPlanByRange } from 'src/app/application/services/get-meal-plan-by-range.usecase';
import { DISH_REPOSITORY } from 'src/app/core/tokens';
import { DishRepository } from 'src/app/domain/repositories/dish.repository';
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
    tap(() => this.loading.set(true)), // Empezar carga
    switchMap(async ([user, params]) => {
      const uid = user!.uid;
      const start = params['start'] || new Date().toISOString().slice(0, 10); // Default hoy
      const days = +(params['days'] || 7);

      // Calculamos fechas
      const dates = this.buildDates(start, days);
      const end = dates[dates.length - 1];

      // Ejecutamos casos de uso en paralelo
      // Traemos el plan Y los platos para poder mapear nombres
      const [plan, allDishes] = await Promise.all([
        this.getPlanUC.execute(uid, start, end),
        this.dishesRepo.listByUser(uid)
      ]);

      // Creamos el mapa de platos para búsqueda rápida
      const dishesMap = new Map<string, Dish>();
      allDishes.forEach(d => dishesMap.set(d.id, d));

      return { plan, dishesMap, dates, start, days };
    }),
    tap(() => this.loading.set(false)) // Terminar carga
  );

  // 3. Convertimos el flujo en una Signal de solo lectura para el Template
  viewData = toSignal(this.dataStream$, { initialValue: null });

  // --- LÓGICA VISUAL ---

  // Método helper para obtener nombre (ahora recibe los datos ya procesados)
  getDishName(dateISO: string, plan: MealPlan | null, map: Map<string, Dish>): string {
    if (!plan) return '—';
    const dishId = plan.getDishIdForDate(dateISO); // ¡Usamos el método de la Entidad Rica!
    if (!dishId) return '—';
    return map.get(dishId)?.name ?? 'Plato no encontrado';
  }

  openDay(dateISO: string, currentStart: string, currentDays: number) {
    this.router.navigate(['/planner/day', dateISO], {
      queryParams: { start: currentStart, days: currentDays }
    });
  }

  private buildDates(startISO: string, days: number): string[] {
    const res: string[] = [];
    const base = new Date(startISO + 'T00:00:00Z');
    for (let i = 0; i < days; i++) {
      const d = new Date(base);
      d.setUTCDate(base.getUTCDate() + i);
      res.push(d.toISOString().slice(0, 10));
    }
    return res;
  }
}