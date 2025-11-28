import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { Dish } from 'src/app/domain/entities/dish';

@Component({
  selector: 'app-dish-selector-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatListModule],
  template: `
    <h2 mat-dialog-title>Elige un plato para el {{ data.date | date:'dd/MM' }}</h2>
    <mat-dialog-content>
      <mat-list>
        <mat-list-item *ngFor="let dish of data.dishes" (click)="select(dish)" class="cursor-pointer hover:bg-gray-100">
          <span matListItemTitle>{{ dish.name }}</span>
        </mat-list-item>
      </mat-list>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
    </mat-dialog-actions>
  `
})
export class DishSelectorDialogComponent {
  // Recibimos la fecha y la lista de platos disponibles
  data = inject(MAT_DIALOG_DATA) as { date: string, dishes: Dish[] };
  private dialogRef = inject(MatDialogRef<DishSelectorDialogComponent>);

  select(dish: Dish) {
    this.dialogRef.close(dish.id); // Devolvemos el ID seleccionado
  }
}