import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { AccountSettingComponent } from './account-setting/account-setting.component';
import { FoodDishesComponent } from './food-dishes/food-dishes.component';

const routes: Routes = [
    {
        path: 'dashboard',
        component: HomeComponent,
        children: [
            { path: '', component: DashboardComponent },
            { path: 'dishes', component: FoodDishesComponent },
            { path: 'progress', component: ProgressComponent },
            { path: 'grafica1', component: Grafica1Component },
            { path: 'account-settings', component: AccountSettingComponent },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {}