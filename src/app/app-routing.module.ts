import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'
import { AuthRoutingModule } from './auth/auth.routing';

import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { AppShellComponent } from './layout/app-shell/app-shell.component';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  
  //publico
  { path: 'login', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },

  //protegido shell
  {
    path: '',
    component: AppShellComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'profile', loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule) },
      { path: 'recipes', loadChildren: () => import('./features/recipes/recipes.module').then(m => m.RecipesModule) },
    ]
  },

  //404
  { path: '**', component: NopagefoundComponent },
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
    AuthRoutingModule
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }


