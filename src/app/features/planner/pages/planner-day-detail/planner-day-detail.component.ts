import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-planner-day-detail',
  templateUrl: './planner-day-detail.component.html',
  styleUrls: ['./planner-day-detail.component.scss']
})
export class PlannerDayDetailComponent {

  constructor(private route: ActivatedRoute) {
    
  }

  dateISO = this.route.snapshot.paramMap.get('date')!;

}
