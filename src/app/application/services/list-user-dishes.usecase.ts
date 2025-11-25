import { Injectable, inject } from '@angular/core';
import { DISH_REPOSITORY } from '../../core/tokens';
import { DishRepository } from '../../domain/repositories/dish.repository';

@Injectable({ providedIn: 'root' })
    
export class ListUserDishes {
    private repo = inject<DishRepository>(DISH_REPOSITORY);
    execute(userId: string) {
        return this.repo.listByUser(userId);
    }
}
