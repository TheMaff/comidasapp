import { Injectable, inject } from '@angular/core';
import { MEAL_PLAN_REPOSITORY } from '../../core/tokens';
import { MealPlanRepository } from '../../domain/repositories/meal-plan.repository';

@Injectable({ providedIn: 'root' })
export class GetMealPlanByRange {
    private repo = inject<MealPlanRepository>(MEAL_PLAN_REPOSITORY);
    execute(ownerId: string, start: string, end: string) {
        return this.repo.getByRange(ownerId, start, end);
    }
}
