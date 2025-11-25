import { Component } from '@angular/core';
import { FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { Firestore, collection, doc } from '@angular/fire/firestore';

import { CreateDish } from '../../../../application/services/create-recipe.usecase';
import { AuthService } from '../../../../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
    RouterModule
  ],
  selector: 'app-recipe-create',
  templateUrl: './recipe-create.component.html',
})
export class RecipeCreateComponent {
  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    servings: [4, [Validators.required, Validators.min(1)]],
    steps: this.fb.array<string>([]),
    ingredients: this.fb.array(this.initIngredient())
  });

  get ingredients() { return this.form.get('ingredients') as FormArray; }
  get steps() { return this.form.get('steps') as FormArray; }

  constructor(
    private fb: FormBuilder,
    private createDish: CreateDish,
    private auth: AuthService,
    private router: Router,
    private fs: Firestore) { }

  initIngredient() {
    return [this.fb.group({ name: [''], unit: ['unit'], amount: [1] })];
  }

  addIngredient() { this.ingredients.push(this.fb.group({ name: [''], unit: ['unit'], amount: [1] })); }
  addStep() { this.steps.push(this.fb.control('')); }

  async save() {
    if (this.form.invalid) return;
    const uid = (await firstValueFrom(this.auth.user$))?.uid!;
    await this.createDish.execute({
      ownerId: uid,
      name: this.form.value.name!,
      servings: this.form.value.servings!,
      ingredients: this.form.value.ingredients as any,
      steps: this.form.value.steps as any
    });
    this.router.navigateByUrl('/recipes');
  }
}
