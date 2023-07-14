import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DishComponent } from './dish/dish.component';


@NgModule({
  declarations: [
    DishComponent
  ],
  exports: [
    DishComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ComponentsModule { }
