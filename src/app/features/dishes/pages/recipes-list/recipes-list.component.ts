import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop'; // 👈 La magia de RxJS a Signals
import { switchMap, tap, filter, map } from 'rxjs/operators';
import { from } from 'rxjs';

// Tus importaciones de negocio
import { ListUserRecipes } from '../../../../application/services/list-user-recipes.usecase';
import { AuthService } from '../../../../services/auth.service';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    RouterModule
  ],
  selector: 'app-recipes-list', // A futuro: renombrar a app-dishes-list
  templateUrl: './recipes-list.component.html',
})
export class RecipesListComponent {
  // 1. Inyección de Dependencias moderna (sin constructor)
  private listRecipesUC = inject(ListUserRecipes);
  private auth = inject(AuthService);

  displayedColumns = ['name', 'servings', 'actions'];

  // 2. Estado Reactivo: Señal para el loading
  loading = signal<boolean>(true);

  // 3. Flujo Declarativo (Async Pipe con esteroides)
  // Escucha al usuario -> Cuando llega, llama al caso de uso -> Convierte el resultado en Signal
  data = toSignal(
    this.auth.user$.pipe(
      // Filtramos para asegurar que hay usuario (evita llamadas con null)
      filter(user => !!user),
      // Side effect: Aseguramos que loading esté en true antes de cargar
      tap(() => this.loading.set(true)),
      // SwitchMap maneja la Promesa del caso de uso automáticamente
      switchMap(user => from(this.listRecipesUC.execute(user!.uid))),
      // Side effect: Cuando terminamos, bajamos el loading
      tap(() => this.loading.set(false))
    ),
    { initialValue: [] } // Valor inicial mientras carga
  );

  // ¡Adiós ngOnInit! Ya no hace falta.
}