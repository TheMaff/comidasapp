import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { SharedModule } from '../shared/shared.module';

import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent,
    ProgressComponent,
    Grafica1Component
  ],
  exports: [
    DashboardComponent,
    HomeComponent,
    ProgressComponent,
    Grafica1Component
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ]
})
export class PagesModule { }
