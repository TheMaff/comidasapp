import { Recipe } from '../entities/dish';
import { CreateDishDTO } from '../dtos/create-dish.dto';

export interface RecipeRepository {
    getById(id: string): Promise<Recipe | null>;
    listByUser(userId: string): Promise<Recipe[]>;
    create(dishData: CreateDishDTO): Promise<void>;
    update(recipe: Recipe): Promise<void>;
    delete(id: string): Promise<void>;
}
