import { Injectable, inject } from '@angular/core';
import { RECIPE_REPOSITORY } from '../../core/tokens';
import { DishRepository } from '../../domain/repositories/dish.repository';

@Injectable({ providedIn: 'root' })
    
export class ListUserRecipes {
    private repo = inject<DishRepository>(RECIPE_REPOSITORY);
    execute(userId: string) {
        return this.repo.listByUser(userId);
    }
}
