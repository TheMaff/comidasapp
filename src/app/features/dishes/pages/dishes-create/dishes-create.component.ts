import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';

// Material & UI
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// Dominio
import { CreateDish } from '../../../../application/services/create-dishes.usecase';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-dish-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './dishes-create.component.html',
})
export class DishCreateComponent {
  private fb = inject(FormBuilder);
  private createDish = inject(CreateDish);
  private auth = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  saving = signal(false);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    servings: [4, [Validators.required, Validators.min(1)]],
    // Ingredientes (FormArray)
    ingredients: this.fb.array([this.newIngredient()]),
    // Pasos (FormArray)
    steps: this.fb.array([this.fb.control('', Validators.required)])
  });

  get ingredients() { return this.form.get('ingredients') as FormArray; }
  get steps() { return this.form.get('steps') as FormArray; }

  newIngredient() {
    return this.fb.group({
      name: ['', Validators.required],
      amount: [1, Validators.min(0)],
      unit: ['unit', Validators.required]
    });
  }

  addIngredient() {
    this.ingredients.push(this.newIngredient());
  }

  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  addStep() {
    this.steps.push(this.fb.control('', Validators.required));
  }

  removeStep(index: number) {
    this.steps.removeAt(index);
  }

  async save() {
    if (this.form.invalid) return;

    this.saving.set(true);
    try {
      const uid = (await firstValueFrom(this.auth.user$))?.uid!;

      await this.createDish.execute({
        ownerId: uid,
        name: this.form.value.name!,
        servings: this.form.value.servings!,
        ingredients: this.form.value.ingredients as any,
        steps: this.form.value.steps as any
      });

      this.snackBar.open('¡Plato creado con éxito!', 'OK', { duration: 3000 });
      this.router.navigateByUrl('/dishes');
    } catch (e) {
      console.error(e);
      this.snackBar.open('Error al guardar el plato', 'Cerrar');
    } finally {
      this.saving.set(false);
    }
  }
}