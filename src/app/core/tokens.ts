import { InjectionToken } from '@angular/core';
import { RecipeRepository } from '../domain/repositories/recipe.repository';
import { UserRepository } from '../domain/repositories/user.repository';

export const RECIPE_REPOSITORY = new InjectionToken<RecipeRepository>('RECIPE_REPOSITORY');
export const USER_REPOSITORY = new InjectionToken<UserRepository>('USER_REPOSITORY');
