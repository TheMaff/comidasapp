import { Ingredient } from '../value-objects/ingredient';

export interface Nutrition {
    kcal: number;
    protein: number;  // g
    carbs: number;    // g
    fat: number;      // g
}

export interface Recipe {
    id: string;
    ownerId: string;            // uid usuario
    name: string;
    servings: number;           // porciones
    ingredients: Ingredient[];
    steps: string[];            // instrucciones
    nutrition?: Nutrition;      // por porción
    tags?: string[];            // ej: "sin gluten", "vegano"
    costPerServing?: number;    // opcional
    createdAt?: string | Date;
    updatedAt?: string | Date;
}
