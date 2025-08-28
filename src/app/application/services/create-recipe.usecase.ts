import { Injectable, inject } from '@angular/core';
import { RECIPE_REPOSITORY } from '../../core/tokens';
import { RecipeRepository } from '../../domain/repositories/recipe.repository';
import { Recipe } from '../../domain/entities/recipe';

@Injectable({ providedIn: 'root' })
export class CreateRecipe {
    private repo = inject<RecipeRepository>(RECIPE_REPOSITORY);
    async execute(recipe: Recipe) {
        // aquí puedes validar reglas de negocio (DDD)
        if (!recipe.name || recipe.servings <= 0) {
            throw new Error('Datos inválidos para receta');
        }
        return this.repo.create(recipe);
    }
}
