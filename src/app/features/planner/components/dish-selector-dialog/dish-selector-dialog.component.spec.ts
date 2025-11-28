import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DishSelectorDialogComponent } from './dish-selector-dialog.component';

describe('DishSelectorDialogComponent', () => {
  let component: DishSelectorDialogComponent;
  let fixture: ComponentFixture<DishSelectorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DishSelectorDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DishSelectorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
