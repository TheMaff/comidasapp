// src/app/domain/dtos/create-dish.dto.ts

import { Ingredient } from '../value-objects/ingredient';
import { Nutrition } from '../entities/dish'; // Importamos de la entidad Dish

export interface CreateDishDTO {
    
    ownerId: string;
    name: string;
    servings: number;
    ingredients: Ingredient[];
    steps: string[];
    nutrition?: Nutrition;
    tags?: string[];
    costPerServing?: number;
}