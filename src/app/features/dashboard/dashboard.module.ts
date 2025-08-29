import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';


//Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

@NgModule({
    declarations: [ DashboardComponent],
    imports: [
        CommonModule,
        DashboardRoutingModule,

        //Material
        MatCardModule,
        MatButtonModule,
        MatIconModule,
    ],
})
export class DashboardModule { }
