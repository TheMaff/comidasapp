import { InjectionToken } from '@angular/core';
import { RecipeRepository } from '../domain/repositories/recipe.repository';
import { UserRepository } from '../domain/repositories/user.repository';
import { MealPlanRepository } from '../domain/repositories/meal-plan.repository';

export const RECIPE_REPOSITORY = new InjectionToken<RecipeRepository>('RECIPE_REPOSITORY');
export const USER_REPOSITORY = new InjectionToken<UserRepository>('USER_REPOSITORY');
export const MEAL_PLAN_REPOSITORY = new InjectionToken<MealPlanRepository>('MEAL_PLAN_REPOSITORY');

// PlannerService (heurística)
export interface PlannerService {
    proposePlan(params: { ownerId: string; startDate: string; endDate: string }): Promise<import('../domain/entities/meal-plan').MealPlan>;
}
export const PLANNER_SERVICE = new InjectionToken<PlannerService>('PLANNER_SERVICE');
