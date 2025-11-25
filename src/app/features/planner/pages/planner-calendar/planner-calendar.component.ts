import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { GetMealPlanByRange } from 'src/app/application/services/get-meal-plan-by-range.usecase';
import { DISH_REPOSITORY } from 'src/app/core/tokens';
import { MealPlan } from 'src/app/domain/entities/meal-plan';
import { Dish } from 'src/app/domain/entities/dish';
import { DishRepository } from 'src/app/domain/repositories/dish.repository';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-planner-calendar',
  templateUrl: './planner-calendar.component.html',
  styleUrls: ['./planner-calendar.component.scss']
})
export class PlannerCalendarComponent {

  start!: string;
  days!: number;
  dates: string[] = [];

  loading = true;

  plan: MealPlan | null = null;
  dishesById = new Map<string, Dish>();

  private auth = inject(AuthService);
  private repo = inject(DISH_REPOSITORY) as DishRepository;

  constructor(
    private route: Router,
    private router: ActivatedRoute,
    private getPlan: GetMealPlanByRange) { }
  
  async ngOnInit() {
    try {
      
      const qp = this.router.snapshot.queryParamMap;
      this.start = qp.get('start')!;
      this.days = +(qp.get('days') || 7);
      this.dates = this.buildDates(this.start, this.days);
      
      const end = this.dates[this.dates.length - 1];
      const uid = (await firstValueFrom(this.auth.user$))!.uid;
      
      // 1) Cargar plan por rango
      this.plan = await this.getPlan.execute(uid, this.start, end);
      
      // 2) Pre-cargar recetas usadas para poder mostrar nombre
      if (this.plan) {
        const ids = Array.from(new Set(this.plan.assignments.map(a => a.dishId)));
        const all = await this.repo.listByUser(uid);
        for (const r of all) if (ids.includes(r.id)) this.dishesById.set(r.id, r);
      }
    } finally {
      this.loading = false;
    }
  }

  buildDates(startISO: string, days: number) {
    const res: string[] = [];
    const base = new Date(startISO + 'T00:00:00Z');
    for (let i = 0; i < days; i++) {
      const d = new Date(base);
      d.setUTCDate(base.getUTCDate() + i);
      res.push(d.toISOString().slice(0, 10));
    }
    return res;
  }

  getDishName(dateISO: string): string {
    if (!this.plan) return '—';
    const asg = this.plan.assignments.find(a => a.date === dateISO);
    if (!asg) return '—';
    return this.dishesById.get(asg.dishId)?.name ?? asg.dishId;
  }

  openDay(dateISO: string) {
    this.route.navigate(['/planner/day', dateISO], {
      queryParams: { start: this.start, days: this.days }
    });
  }

}
