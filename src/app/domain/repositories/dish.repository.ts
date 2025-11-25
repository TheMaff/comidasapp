import { Dish } from '../entities/dish';
import { CreateDishDTO } from '../dtos/create-dish.dto';

export interface DishRepository {
    getById(id: string): Promise<Dish | null>;
    listByUser(userId: string): Promise<Dish[]>;
    create(dishData: CreateDishDTO): Promise<void>;
    update(dish: Dish): Promise<void>;
    delete(id: string): Promise<void>;
}
