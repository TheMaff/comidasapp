import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, tap, map, filter } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

// Material
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// Dominio
import { GenerateShoppingList } from 'src/app/application/services/generate-shopping-list.usecase';
import { AuthService } from 'src/app/services/auth.service';
import { ShoppingList } from 'src/app/domain/entities/shopping-list';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-shopping-list',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        MatCardModule,
        MatListModule,
        MatIconModule,
        MatButtonModule,
        MatCheckboxModule,
        MatSnackBarModule
    ],
    templateUrl: './shopping-list.component.html',
    styles: [`
    .strikethrough { text-decoration: line-through; color: gray; }
  `]
})
export class ShoppingListComponent {
    private generateList = inject(GenerateShoppingList);
    private auth = inject(AuthService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private snackBar = inject(MatSnackBar);

    loading = signal(true);

    // --- Flujo Reactivo ---
    private dataStream$ = combineLatest([
        this.auth.user$.pipe(filter(u => !!u)),
        this.route.queryParams
    ]).pipe(
        tap(() => this.loading.set(true)),
        switchMap(async ([user, params]) => {
            // Por defecto: Hoy y los próximos 7 días (igual que el planner)
            const start = params['start'] || new Date().toISOString().slice(0, 10);
            const days = +(params['days'] || 7);

            // Calculamos fecha fin
            const endDate = new Date(start);
            endDate.setUTCDate(endDate.getUTCDate() + (days - 1));
            const endStr = endDate.toISOString().slice(0, 10);

            // 🔥 LLAMADA AL CASO DE USO
            const list = await this.generateList.execute(user!.uid, start, endStr);

            return { list, start, days };
        }),
        tap(() => this.loading.set(false))
    );

    // Signal principal con los datos
    viewData = toSignal(this.dataStream$, { initialValue: null });

    // --- Acciones UI ---

    /**
     * Copia la lista al portapapeles en formato texto
     */
    copyToClipboard(list: ShoppingList) {
        const text = list.items
            .map(i => `- [ ] ${i.amount} ${i.unit} ${i.name}`)
            .join('\n');

        navigator.clipboard.writeText(text).then(() => {
            this.snackBar.open('Lista copiada al portapapeles 📋', 'OK', { duration: 3000 });
        });
    }

    /**
     * Navegación rápida para cambiar de semana (Opcional, reutiliza lógica del planner)
     */
    changeWeek(offset: number) {
        const currentData = this.viewData();
        if (!currentData) return;

        const base = new Date(currentData.start);
        base.setUTCDate(base.getUTCDate() + (offset * 7));
        const newStart = base.toISOString().slice(0, 10);

        this.router.navigate([], {
            queryParams: { start: newStart, days: currentData.days }
        });
    }
}