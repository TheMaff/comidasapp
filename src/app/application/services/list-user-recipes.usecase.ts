import { Injectable, inject } from '@angular/core';
import { RECIPE_REPOSITORY } from '../../core/tokens';
import { RecipeRepository } from '../../domain/repositories/recipe.repository';

@Injectable({ providedIn: 'root' })
    
export class ListUserRecipes {
    private repo = inject<RecipeRepository>(RECIPE_REPOSITORY);
    execute(userId: string) {
        return this.repo.listByUser(userId);
    }
}
