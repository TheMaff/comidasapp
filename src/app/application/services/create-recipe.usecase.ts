import { Injectable, inject } from '@angular/core';
import { RECIPE_REPOSITORY } from '../../core/tokens';
import { RecipeRepository } from '../../domain/repositories/recipe.repository';
import { CreateDishDTO } from '../../domain/dtos/create-dish.dto';

@Injectable({ providedIn: 'root' })
export class CreateDish {
    private repo = inject<RecipeRepository>(RECIPE_REPOSITORY);
    
    async execute(dishData: CreateDishDTO) {
        // aquí puedes validar reglas de negocio (DDD)
        if (!dishData.name || dishData.servings <= 0) {
            throw new Error('Datos inválidos para plato');
        }
        return this.repo.create(dishData);
    }
}
