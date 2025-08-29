import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';

import { AppShellComponent } from './app-shell/app-shell.component';

@NgModule({
    declarations: [AppShellComponent],
    imports: [
        CommonModule,
        RouterModule,     // <- para routerLink y <router-outlet>
        MaterialModule    // <- todos los Mat* usados en el shell
    ],
    exports: [AppShellComponent]
})
export class LayoutModule { }
