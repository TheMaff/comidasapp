import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { GetMealPlanByRange } from 'src/app/application/services/get-meal-plan-by-range.usecase';
import { SaveMealPlan } from 'src/app/application/services/save-meal-plan.usecase';
import { DISH_REPOSITORY } from 'src/app/core/tokens';
import { MealPlan } from 'src/app/domain/entities/meal-plan';
import { Dish } from 'src/app/domain/entities/dish';
import { DishRepository } from 'src/app/domain/repositories/dish.repository';
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
  dishes: Dish[] = [];
  selectedDishId: string | null = null;

  loading = true;
  saving = false;

  private auth = inject(AuthService);
  private dishesRepo = inject(DISH_REPOSITORY) as DishRepository;

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
      this.dishes = await this.dishesRepo.listByUser(uid);

      // receta actual del día (si existe)
      const asg = this.plan?.assignments.find(a => a.date === this.date);
      this.selectedDishId = asg?.dishId ?? null;
    } finally {
      this.loading = false;
    }
  }

  async save() {
    if (!this.plan || !this.selectedDishId) return;
    this.saving = true;
    try {
      const idx = this.plan.assignments.findIndex(a => a.date === this.date);
      if (idx >= 0) {
        this.plan.assignments[idx] = { ...this.plan.assignments[idx], dishId: this.selectedDishId };
      } else {
        this.plan.assignments.push({ date: this.date, dishId: this.selectedDishId });
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
