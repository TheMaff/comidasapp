import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { ProgressComponent } from './progress/progress.component';
import { FoodDishesComponent } from './food-dishes/food-dishes.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { AccountSettingComponent } from './account-setting/account-setting.component';

//Modulos
import { SharedModule } from '../shared/shared.module';
import { ComponentsModule } from '../components/components.module';
import { FormsModule } from "@angular/forms";


@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent,
    ProgressComponent,
    FoodDishesComponent,
    Grafica1Component,
    AccountSettingComponent
  ],
  exports: [
    DashboardComponent,
    HomeComponent,
    ProgressComponent,
    FoodDishesComponent,
    Grafica1Component,
    AccountSettingComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    RouterModule,
    ComponentsModule
  ]
})
export class PagesModule { }
