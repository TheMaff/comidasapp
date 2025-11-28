import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
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
import { SaveMealPlan } from 'src/app/application/services/save-meal-plan.usecase';

// UI Modules
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { DishSelectorDialogComponent } from '../../components/dish-selector-dialog/dish-selector-dialog.component';
import { DayCardComponent } from '../../components/day-card/day-card.component';

interface MonthGroup {
  title: string;      // "Noviembre 2025"
  year: number;
  month: number;      // 0-11
  dates: string[];    // Fechas ISO o strings vacíos '' para relleno
}

const MAX_PLAN_DAYS = 60;

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
    MatDialogModule,
    DayCardComponent
  ]
})
export class PlannerCalendarComponent {
  // Inyecciones
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);
  private getPlanUC = inject(GetMealPlanByRange);
  private dialog = inject(MatDialog);
  private savePlanUC = inject(SaveMealPlan);
  private dishesRepo = inject(DISH_REPOSITORY) as DishRepository;
  private mealPlanRepo = inject(MEAL_PLAN_REPOSITORY) as MealPlanRepository;
  private todayISO = new Date().toLocaleDateString('sv-SE'); // Formato ISO local seguro

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

      // 🚨 NUEVO: Agrupación por Meses
      const months = this.groupDatesByMonth(planStart, planEnd);

      return {
        plan,
        dishesMap,
        months,
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

  private groupDatesByMonth(start: Date, end: Date): MonthGroup[] {
    const groups: MonthGroup[] = [];
    let current = new Date(start);

    // Mientras no nos pasemos de la fecha final
    while (current <= end) {
      const currentMonth = current.getMonth();
      const currentYear = current.getFullYear();

      // Título del mes
      const monthName = current.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

      const monthDates: string[] = [];

      // 1. Padding Inicial (Si el mes/rango empieza un Miércoles, rellenar Lun-Mar)
      // Ojo: getDay() -> Domingo=0, Lunes=1. Queremos Lunes=0 ... Domingo=6
      const startDayOfWeek = (current.getDay() + 6) % 7;
      for (let i = 0; i < startDayOfWeek; i++) {
        monthDates.push(''); // Relleno vacío
      }

      // 2. Llenar días del mes (hasta que cambie el mes o se acabe el rango)
      while (current <= end && current.getMonth() === currentMonth) {
        monthDates.push(current.toISOString().slice(0, 10));
        current.setDate(current.getDate() + 1);
      }

      // 3. Padding Final (Para completar la fila de 7 al final del mes)
      const endDayOfWeek = (new Date(current.getTime() - 86400000).getDay() + 6) % 7;
      const remaining = 6 - endDayOfWeek;
      for (let i = 0; i < remaining; i++) {
        // 🚨 CAMBIO CLAVE: Usamos la fecha real, no vacío
        monthDates.push(current.toISOString().slice(0, 10));
        // Avanzamos el puntero de fecha para la siguiente vuelta
        current.setDate(current.getDate() + 1);
      }

      // 4. Agregar días de "Extensión" visual (opcional, para llenar la grilla visualmente hasta el final de la fila)
      // Ya lo hicimos en el paso 3.

      groups.push({
        title: monthName,
        year: currentYear,
        month: currentMonth,
        dates: monthDates
      });
    }
    return groups;
  }

  // --- ACCIONES (Toolbar) ---

  print() {
    window.print();
  }

  async share() {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    // Usar snackbar (inyectalo si no lo tienes)
    alert('Link copiado al portapapeles (Simulado)');
  }

  async deletePlan() {
    if (confirm('¿Estás seguro de eliminar toda esta planificación?')) {
      // Aquí llamarías a this.mealPlanRepo.delete(id)
      // Como no tenemos el método en el repo aún, simulamos limpieza
      // O podrías actualizar el plan borrando assignments.
      alert('Funcionalidad de borrar pendiente de conectar con Repo');
    }
  }

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

  // Verifica si una fecha ya pasó (Ayer o antes)
  isPast(dateISO: string): boolean {
    return dateISO < this.todayISO;
  }

  async openDay(dateISO: string, data: any) {
    // 🛑 1. BLOQUEO DE PASADO
    if (this.isPast(dateISO)) {
      // Opcional: Mostrar un snackbar "No puedes editar el pasado"
      return;
    }

    // Caso 1: Edición normal (Dentro del plan)
    if (this.isInPlan(dateISO, data.planStartStr, data.planEndStr)) {
      this.router.navigate(['/planner/day', dateISO], { queryParams: data.currentParams });
      return;
    }

    // Caso 2: Está FUERA del plan (Futuro) -> EXTENDER
    if (dateISO > data.planEndStr) {
      // 🛑 2. BLOQUEO DE LÍMITE (MAX_DAYS)
      const currentStart = new Date(data.planStartStr);
      const targetDate = new Date(dateISO);
      // Diferencia en días
      const diffTime = Math.abs(targetDate.getTime() - currentStart.getTime());
      const projectedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      if (projectedDays > MAX_PLAN_DAYS) {
        alert(`Has alcanzado el límite de ${MAX_PLAN_DAYS} días por planificación. Por favor, crea un nuevo plan para continuar.`);
        // Aquí podrías redirigir a /planner/settings para crear uno nuevo desde esa fecha
        return;
      }

      // Si pasa las validaciones, abrimos el diálogo (Tu código existente)...
      const dishesArray = Array.from(data.dishesMap.values() as Iterable<Dish>); // Fix de tipo si es necesario
      // Convertir el Map de platos a Array para el diálogo
      // const dishesArray = Array.from(data.dishesMap.values());

      const dialogRef = this.dialog.open(DishSelectorDialogComponent, {
        data: { date: dateISO, dishes: dishesArray },
        width: '400px'
      });

      dialogRef.afterClosed().subscribe(async (selectedDishId) => {
        if (selectedDishId) {
          this.loading.set(true);
          try {
            // 1. Obtener el plan más fresco de la BD (para no perder datos)
            // Usamos el ID del plan actual
            const currentPlanId = data.plan.id;

            // Necesitamos un método getById en el repo, o usamos getByRange con el rango original
            // Asumamos que data.plan está actualizado o lo recargamos.
            const plan = data.plan as MealPlan;

            // 2. Asignar el nuevo plato (esto actualiza el array assignments interno)
            plan.assignDish(dateISO, selectedDishId);

            // 3. 🚨 EXTENSIÓN: Actualizar la fecha de fin del plan si el nuevo día está fuera
            if (dateISO > plan.endDate) {
              // Aquí deberíamos tener un método setEndDate en la entidad, 
              // o hacerlo "a la mala" si props es privado (depende de tu implementación de MealPlan).
              // Si props es privado, agrega un método extendTo(date) en la entidad MealPlan.

              // Opción rápida (si tienes acceso o getters/setters):
              // plan.endDate = dateISO; 

              // Opción Correcta (DDD): Agrega este método a MealPlan.ts
              plan.extendTo(dateISO);
            }

            // 4. Guardar el plan completo actualizado
            await this.savePlanUC.execute(plan);

            // 5. Recargar la vista
            // Calculamos la nueva duración total para la URL
            const start = new Date(data.planStartStr);
            const newEnd = new Date(dateISO);
            const newDays = Math.ceil((newEnd.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;

            this.router.navigate([], {
              queryParams: { start: data.planStartStr, days: newDays }
            });

          } catch (e) {
            console.error('Error extendiendo plan:', e);
          } finally {
            this.loading.set(false);
          }
        }
      });
    }
  }
}