import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannerDayDetailComponent } from './planner-day-detail.component';

describe('PlannerDayDetailComponent', () => {
  let component: PlannerDayDetailComponent;
  let fixture: ComponentFixture<PlannerDayDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlannerDayDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlannerDayDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
