import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from "@angular/forms";

import { RouterModule } from '@angular/router';
import { AccountSettingComponent } from './account-setting/account-setting.component';

@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent,
    ProgressComponent,
    Grafica1Component,
    AccountSettingComponent
  ],
  exports: [
    DashboardComponent,
    HomeComponent,
    ProgressComponent,
    Grafica1Component,
    AccountSettingComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    RouterModule
  ]
})
export class PagesModule { }
