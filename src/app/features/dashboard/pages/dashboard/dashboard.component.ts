import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Material (Solo lo esencial para iconos/botones)
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dashboard',
  standalone: true, // 👈 La clave
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  // Datos simulados para la UI (luego los conectarás a tus UseCases)
  stats = signal({
    plannedDays: 12,
    totalDays: 30,
    budgetEstimated: 42500,
    budgetLimit: 50000
  });

  recentDishes = signal([
    { name: 'Porotos Granados', time: '45 min', type: 'Casero' },
    { name: 'Charquicán', time: '30 min', type: 'Rápido' },
    { name: 'Lentejas', time: '40 min', type: 'Veggie' }
  ]);

  quickActions = [
    { label: 'Planificar Semana', icon: 'calendar_today', link: '/planner' },
    { label: 'Nueva Receta', icon: 'restaurant_menu', link: '/dishes/new' },
    { label: 'Ver Lista', icon: 'shopping_cart', link: '/shopping-list' }
  ];
}