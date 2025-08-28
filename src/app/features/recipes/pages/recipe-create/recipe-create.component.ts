import { Component } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { Firestore, collection, doc } from '@angular/fire/firestore';

import { CreateRecipe } from '../../../../application/services/create-recipe.usecase';
import { AuthService } from '../../../../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
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
    private createRecipe: CreateRecipe,
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
    const id = doc(collection(this.fs, 'recipes')).id;
    await this.createRecipe.execute({
      id,
      ownerId: uid,
      name: this.form.value.name!,
      servings: this.form.value.servings!,
      ingredients: this.form.value.ingredients as any,
      steps: this.form.value.steps as any
    });
    this.router.navigateByUrl('/recipes');
  }
}
