import { Component } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-planner-calendar',
  templateUrl: './planner-calendar.component.html',
  styleUrls: ['./planner-calendar.component.scss']
})
export class PlannerCalendarComponent {

  start!: string;
  days!: number;
  dates: string[] = [];

  constructor(private route: Router, private router: ActivatedRoute) { }
  
  ngOnInit(): void {
    const qp = this.router.snapshot.queryParamMap;
    this.start = qp.get('start')!;
    this.days = +(qp.get('days') || 7);
    this.dates = this.buildDates(this.start, this.days);
  }

  buildDates(startISO: string, days: number) {
    const res: string[] = [];
    const base = new Date(startISO + 'T00:00:00Z');
    for (let i = 0; i < days; i++) {
      const d = new Date(base); d.setUTCDate(base.getUTCDate() + i);
      res.push(d.toISOString().slice(0, 10));
    }
    return res;
  }

  openDay(dateISO: string) {

    this.route.navigate(['/planner/day', dateISO]);
  }

}
