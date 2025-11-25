import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipesListComponent } from './pages/recipes-list/recipes-list.component';
import { RecipeCreateComponent } from './pages/recipe-create/recipe-create.component';

const routes: Routes = [
  { path: '', component: RecipesListComponent },
  { path: 'new', component: RecipeCreateComponent },
  
  {
    path: ':dishId',
    component: RecipeCreateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export default class DISHES_ROUTES { }
