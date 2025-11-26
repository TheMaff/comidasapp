import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-day-card',
  templateUrl: './day-card.component.html',
  styleUrls: ['./day-card.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule]
})
export class DayCardComponent {
  @Input() date!: string;
  @Input() title!: string;
}
