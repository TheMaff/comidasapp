import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'

import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { AppShellComponent } from './layout/app-shell/app-shell.component';
import { authGuard } from './guards/auth.guard';
import { publicGuard } from './guards/public.guard';

const routes: Routes = [
  
  //publico
  {
    path: 'login',
    canActivate: [publicGuard],
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    canActivate: [publicGuard],
    loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent)
  },

  //protegido shell
  {
    path: '',
    component: AppShellComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard.routes') },
      { path: 'profile', loadChildren: () => import('./features/profile/profile.routes') },
      { path: 'dishes', loadChildren: () => import('./features/dishes/dishes.routes') },
      { path: 'planner', loadChildren: () => import('./features/planner/planner.routes') },
      { path: 'shopping-list', loadChildren: () => import('./features/shopping-list/shopping-list.routes') },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  

  //404
  { path: '**', component: NopagefoundComponent },
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }


