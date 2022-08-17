import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodDishesComponent } from './food-dishes.component';

describe('FoodDishesComponent', () => {
  let component: FoodDishesComponent;
  let fixture: ComponentFixture<FoodDishesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FoodDishesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoodDishesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
