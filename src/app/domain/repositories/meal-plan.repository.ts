import { MealPlan } from '../entities/meal-plan';

export interface MealPlanRepository {
    getByRange(ownerId: string, startDate: string, endDate: string): Promise<MealPlan | null>;
    save(plan: MealPlan): Promise<void>;

    // Solo la firma del método, sin código
    findActivePlan(ownerId: string): Promise<MealPlan | null>;
}
