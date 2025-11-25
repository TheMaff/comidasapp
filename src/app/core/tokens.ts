import { InjectionToken } from '@angular/core';
import { DishRepository } from '../domain/repositories/dish.repository';
import { UserRepository } from '../domain/repositories/user.repository';
import { MealPlanRepository } from '../domain/repositories/meal-plan.repository';

export const RECIPE_REPOSITORY = new InjectionToken<DishRepository>('RECIPE_REPOSITORY');
export const USER_REPOSITORY = new InjectionToken<UserRepository>('USER_REPOSITORY');
export const MEAL_PLAN_REPOSITORY = new InjectionToken<MealPlanRepository>('MEAL_PLAN_REPOSITORY');

// PlannerService (heurística)
export interface PlannerService {
    proposePlan(params: { ownerId: string; startDate: string; endDate: string }): Promise<import('../domain/entities/meal-plan').MealPlan>;
}
export const PLANNER_SERVICE = new InjectionToken<PlannerService>('PLANNER_SERVICE');
