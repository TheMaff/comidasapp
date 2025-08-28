import { Recipe } from '../entities/recipe';

export interface RecipeRepository {
    getById(id: string): Promise<Recipe | null>;
    listByUser(userId: string): Promise<Recipe[]>;
    create(recipe: Recipe): Promise<void>;
    update(recipe: Recipe): Promise<void>;
    delete(id: string): Promise<void>;
}
