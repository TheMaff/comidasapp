import { Injectable, inject } from '@angular/core';
import { MEAL_PLAN_REPOSITORY } from '../../core/tokens';
import { MealPlanRepository } from '../../domain/repositories/meal-plan.repository';
import { MealPlan } from '../../domain/entities/meal-plan';

@Injectable({ providedIn: 'root' })
export class SaveMealPlan {
    private repo = inject<MealPlanRepository>(MEAL_PLAN_REPOSITORY);
    execute(plan: MealPlan) { return this.repo.save(plan); }
}
