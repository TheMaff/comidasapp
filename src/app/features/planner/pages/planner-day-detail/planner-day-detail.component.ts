import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { GetMealPlanByRange } from 'src/app/application/services/get-meal-plan-by-range.usecase';
import { SaveMealPlan } from 'src/app/application/services/save-meal-plan.usecase';
import { RECIPE_REPOSITORY } from 'src/app/core/tokens';
import { MealPlan } from 'src/app/domain/entities/meal-plan';
import { Recipe } from 'src/app/domain/entities/dish';
import { RecipeRepository } from 'src/app/domain/repositories/recipe.repository';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-planner-day-detail',
  templateUrl: './planner-day-detail.component.html',
  styleUrls: ['./planner-day-detail.component.scss']
})
export class PlannerDayDetailComponent implements OnInit {

  date!: string;
  start!: string;
  days!: number;

  plan: MealPlan | null = null;
  recipes: Recipe[] = [];
  selectedRecipeId: string | null = null;

  loading = true;
  saving = false;

  private auth = inject(AuthService);
  private recipeRepo = inject(RECIPE_REPOSITORY) as RecipeRepository;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private getPlan: GetMealPlanByRange,
    private savePlan: SaveMealPlan
  ) {
    
  }
  async ngOnInit() {

    try {
      this.date = this.route.snapshot.paramMap.get('date')!;
      const qp = this.route.snapshot.queryParamMap;
      this.start = qp.get('start')!;
      this.days = +(qp.get('days') || 7);
      const uid = (await firstValueFrom(this.auth.user$))!.uid;

      const end = this.addDaysISO(this.start, this.days - 1);
      this.plan = await this.getPlan.execute(uid, this.start, end);

      // cargar recetas del usuario para el selector
      this.recipes = await this.recipeRepo.listByUser(uid);

      // receta actual del día (si existe)
      const asg = this.plan?.assignments.find(a => a.date === this.date);
      this.selectedRecipeId = asg?.recipeId ?? null;
    } finally {
      this.loading = false;
    }
  }

  async save() {
    if (!this.plan || !this.selectedRecipeId) return;
    this.saving = true;
    try {
      const idx = this.plan.assignments.findIndex(a => a.date === this.date);
      if (idx >= 0) {
        this.plan.assignments[idx] = { ...this.plan.assignments[idx], recipeId: this.selectedRecipeId };
      } else {
        this.plan.assignments.push({ date: this.date, recipeId: this.selectedRecipeId });
      }
      this.plan.updatedAt = new Date().toISOString();
      await this.savePlan.execute(this.plan);
      this.router.navigate(['/planner/calendar'], { queryParams: { start: this.start, days: this.days } });
    } finally {
      this.saving = false;
    }
  }

  // addDaysISO = this.route.snapshot.paramMap.get('date')!;
  private addDaysISO(iso: string, n: number) {
    const base = new Date(iso + 'T00:00:00Z'); base.setUTCDate(base.getUTCDate() + n);
    return base.toISOString().slice(0, 10);
  }

}
