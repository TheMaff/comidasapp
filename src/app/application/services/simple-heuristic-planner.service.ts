import { inject, Injectable } from '@angular/core';
import { PlannerService } from '../../core/tokens';
import { MealPlan, MealAssignment } from '../../domain/entities/meal-plan';
import { Dish } from '../../domain/entities/dish'; // 👈 Importamos la Entidad
import { USER_REPOSITORY, DISH_REPOSITORY } from '../../core/tokens';
import { DishRepository } from '../../domain/repositories/dish.repository';
import { UserRepository } from '../../domain/repositories/user.repository';

// Utiles
const toISO = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (iso: string, n: number) => {
  const base = new Date(iso + 'T00:00:00Z');
  base.setUTCDate(base.getUTCDate() + n);
  return toISO(base);
};

// Estructura interna para el scoring
interface ScoredDish {
  dish: Dish;
  score: number;
  cost: number;
}

@Injectable({ providedIn: 'root' })
export class SimpleHeuristicPlannerService implements PlannerService {
  private userRepo = inject<UserRepository>(USER_REPOSITORY);
  private dishesRepo = inject<DishRepository>(DISH_REPOSITORY);

  async proposePlan(params: { ownerId: string; startDate: string; endDate: string }): Promise<MealPlan> {
    const { ownerId, startDate, endDate } = params;

    // 1) Datos base
    const profile = await this.userRepo.get(ownerId);
    const dishes = await this.dishesRepo.listByUser(ownerId); // Esto ya devuelve Dish[]

    const members = profile?.members ?? [];

    // 2) Filtrado por restricciones (MVP muy simple)
    const allAllergies = new Set(
      members.flatMap(m => (m.allergies ?? []).map(s => s.toLowerCase()))
    );
    const allIntolerances = new Set(
      members.flatMap(m => (m.intolerances ?? []).map(s => s.toLowerCase()))
    );

    // Filtramos usando la Entidad Dish (Adiós 'any')
    const compatible = dishes.filter((dish: Dish) => {
      // Usamos los tags de la entidad. 
      // Nota: Si quieres validar ingredientes específicos, podrías iterar dish.ingredients aquí.
      const tags = dish.tags.map(t => t.toLowerCase());

      // Verificamos si algún tag coincide con una alergia/intolerancia
      // (Asumiendo que etiquetas como "Gluten" o "Nueces" estarían en los tags)
      const hasAllergy = tags.some(t => allAllergies.has(t));
      const hasIntolerance = tags.some(t => allIntolerances.has(t));

      return !hasAllergy && !hasIntolerance;
    });

    // Fallback: Si el filtro es muy estricto y no queda nada, usamos todo para no romper la app
    const pool = compatible.length > 0 ? compatible : dishes;

    // 3) Scoring simple por preferencias
    const prefs = new Set(
      members.flatMap(m => (m.preferences ?? []).map(s => s.toLowerCase()))
    );

    const scored: ScoredDish[] = pool
      .map((dish: Dish) => {
        const tags = dish.tags.map(t => t.toLowerCase());
        // Sumamos puntos si los tags coinciden con preferencias
        const score = tags.reduce((acc, t) => acc + (prefs.has(t) ? 1 : 0), 0);

        // Usamos una lógica simple de costo (podrías agregar propiedad 'cost' a Dish en el futuro)
        const cost = 0;

        return { dish, score, cost };
      })
      // Ordenamos: Mayor score primero, luego menor costo, luego alfabético
      .sort((a, b) => (b.score - a.score) || (a.cost - b.cost) || a.dish.name.localeCompare(b.dish.name));

    // 4) Construir asignaciones
    const dates: string[] = [];
    let d = startDate;
    while (d <= endDate) {
      dates.push(d);
      d = addDays(d, 1);
    }

    const assignments: MealAssignment[] = [];
    const window = 3;

    for (const date of dates) {
      if (scored.length === 0) break; // Seguridad si no hay platos

      // Round-robin simple basado en el índice
      let picked = scored[assignments.length % scored.length].dish;

      // Intento de evitar repetición en ventana de días
      for (const cand of scored) {
        const recent = assignments.slice(-window).some(a => a.dishId === cand.dish.id);
        if (!recent) {
          picked = cand.dish;
          break;
        }
      }

      assignments.push({ date, dishId: picked.id });
    }

    // Retornamos usando el Factory Method de la Entidad Rica
    return MealPlan.fromPrimitives({
      id: '',
      ownerId,
      startDate,
      endDate,
      assignments,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
}