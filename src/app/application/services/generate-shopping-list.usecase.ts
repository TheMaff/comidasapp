// src/app/application/services/generate-shopping-list.usecase.ts

import { Injectable, inject } from '@angular/core';
import { MealPlanRepository } from '../../domain/repositories/meal-plan.repository';
import { DishRepository } from '../../domain/repositories/dish.repository';
import { ShoppingList } from '../../domain/entities/shopping-list';
import { MEAL_PLAN_REPOSITORY, DISH_REPOSITORY } from '../../core/tokens';

@Injectable({ providedIn: 'root' })
export class GenerateShoppingList {
    private planRepo = inject<MealPlanRepository>(MEAL_PLAN_REPOSITORY);
    private dishRepo = inject<DishRepository>(DISH_REPOSITORY);

    async execute(ownerId: string, startDate: string, endDate: string): Promise<ShoppingList> {
        // 1. Obtener el plan de comidas del rango
        const plan = await this.planRepo.getByRange(ownerId, startDate, endDate);

        if (!plan || plan.assignments.length === 0) {
            return new ShoppingList([]); // Lista vacía
        }

        // 2. Identificar qué platos únicos necesitamos
        // (Evitamos llamar a la BD 5 veces si comemos lo mismo 5 veces)
        const uniqueDishIds = Array.from(new Set(plan.assignments.map(a => a.dishId)));

        // 3. Traer los detalles de esos platos (para tener los ingredientes)
        // Nota: Esto podría optimizarse con un método 'getManyByIds' en el repositorio a futuro
        const dishesPromises = uniqueDishIds.map(id => this.dishRepo.getById(id));
        const dishes = (await Promise.all(dishesPromises)).filter(d => !!d); // Filtramos nulos

        // Mapa rápido para buscar plato por ID
        const dishesMap = new Map(dishes.map(d => [d!.id, d!]));

        // 4. Instanciar nuestra Entidad de Dominio
        const shoppingList = new ShoppingList();

        // 5. Recorrer el plan día por día y sumar ingredientes
        for (const assignment of plan.assignments) {
            const dish = dishesMap.get(assignment.dishId);
            if (!dish) continue;

            // Por cada ingrediente del plato, lo agregamos a la lista inteligente
            dish.ingredients.forEach(ing => {
                shoppingList.addItem({
                    name: ing.name,
                    amount: ing.amount,
                    unit: ing.unit
                });
            });
        }

        return shoppingList;
    }
}