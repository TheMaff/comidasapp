import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-planner-form',
  templateUrl: './planner-form.component.html',
  styleUrls: ['./planner-form.component.scss']
})
export class PlannerFormComponent {

  form = this.fb.group({
    startDate: [new Date(), Validators.required],
    days: [7, [Validators.required, Validators.min(1), Validators.max(30)]]
  });

  constructor(private fb: FormBuilder, private router: Router) { }

  next() {
    if (this.form.invalid) return;
    console.log(this.form.value);
    
    
    const start = this.form.value.startDate as Date;
    const days = this.form.value.days as number;
    const startISO = start.toISOString().slice(0, 10);

    console.log(startISO, days);
    

    this.router.navigate(['/planner/calendar'], { queryParams: { start: startISO, days } });
  }

}
