import { Injectable, inject } from '@angular/core';
import { PLANNER_SERVICE } from '../../core/tokens';
import { SaveMealPlan } from './save-meal-plan.usecase';

@Injectable({ providedIn: 'root' })
export class ProposeMealPlan {
    private planner = inject(PLANNER_SERVICE);
    private save = inject(SaveMealPlan);

    async execute(ownerId: string, startDate: string, endDate: string) {
        const plan = await this.planner.proposePlan({ ownerId, startDate, endDate });
        await this.save.execute(plan);
        return plan;
    }
}
