import { inject, Injectable } from '@angular/core';
import { PlannerService } from '../../core/tokens';
import { MealPlan, MealAssignment } from '../../domain/entities/meal-plan';
import { USER_REPOSITORY } from '../../core/tokens';
import { RECIPE_REPOSITORY } from '../../core/tokens';

// Ajusta estas rutas a tus entidades reales
import { RecipeRepository } from '../../domain/repositories/recipe.repository';
import { UserRepository } from '../../domain/repositories/user.repository';

// Utiles
const toISO = (d: Date) => d.toISOString().slice(0,10);
const addDays = (iso: string, n: number) => {
  const base = new Date(iso + 'T00:00:00Z'); base.setUTCDate(base.getUTCDate() + n);
  return toISO(base);
};

@Injectable({ providedIn: 'root' })
export class SimpleHeuristicPlannerService implements PlannerService {
  private userRepo = inject<UserRepository>(USER_REPOSITORY);
  private recipeRepo = inject<RecipeRepository>(RECIPE_REPOSITORY);

  async proposePlan(params: { ownerId: string; startDate: string; endDate: string }): Promise<MealPlan> {
    const { ownerId, startDate, endDate } = params;

    // 1) Datos base
    const profile = await this.userRepo.get(ownerId);
      const recipes = await this.recipeRepo.listByUser(ownerId);

    const members = profile?.members ?? [];
    // 2) Filtrado por restricciones (MVP muy simple)
    const allAllergies = new Set(
      members.flatMap(m => (m.allergies ?? []).map(s => s.toLowerCase()))
    );
    const allIntolerances = new Set(
      members.flatMap(m => (m.intolerances ?? []).map(s => s.toLowerCase()))
    );

    const compatible = recipes.filter((r: any) => {
      const tags: string[] = (r.tags ?? []).map((t: string) => t.toLowerCase());
      // si la receta declara "contains" (ej: gluten, nuts, dairy...), filtra
      const contains: string[] = (r.contains ?? []).map((t: string) => t.toLowerCase());
      const bad1 = contains.some(c => allAllergies.has(c));
      const bad2 = contains.some(c => allIntolerances.has(c));
      return !bad1 && !bad2;
    });

    if (compatible.length === 0) {
      // fallback duro: usa todas las recetas del usuario
      compatible.push(...recipes);
    }

    // 3) Scoring simple por preferencias (más matches = mayor prioridad)
    const prefs = new Set(
      members.flatMap(m => (m.preferences ?? []).map(s => s.toLowerCase()))
    );

    const scored = compatible
      .map((r: any) => {
        const tags: string[] = (r.tags ?? []).map((t: string) => t.toLowerCase());
        const score = tags.reduce((acc, t) => acc + (prefs.has(t) ? 1 : 0), 0);
        const cost = Number(r.costPerServing ?? 0);
        return { r, score, cost };
      })
      .sort((a, b) => (b.score - a.score) || (a.cost - b.cost) || a.r.name.localeCompare(b.r.name));

    // 4) Construir asignaciones (evitar repetir en ±3 días)
    const dates: string[] = [];
    let d = startDate;
    while (d <= endDate) {
      dates.push(d);
      d = addDays(d, 1);
    }

    const assignments: MealAssignment[] = [];
    const window = 3;

    for (const date of dates) {
      let picked = scored[assignments.length % scored.length]?.r;
      // evita repetición en ventana
      for (const cand of scored) {
        const recent = assignments.slice(-window).some(a => a.recipeId === cand.r.id);
        if (!recent) { picked = cand.r; break; }
      }
      assignments.push({ date, recipeId: picked.id });
    }

    const plan: MealPlan = {
      id: '', ownerId, startDate, endDate, assignments,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    };
    return plan;
  }
}