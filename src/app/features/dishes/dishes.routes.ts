import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DishesListComponent } from './pages/dishes-list/dishes-list.component';
import { DishCreateComponent } from './pages/dishes-create/dishes-create.component';

const routes: Routes = [
  { path: '', component: DishesListComponent },
  { path: 'new', component: DishCreateComponent },
  
  {
    path: ':dishId',
    component: DishCreateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export default class DISHES_ROUTES { }
