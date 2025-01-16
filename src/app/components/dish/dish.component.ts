import { Component } from '@angular/core';

@Component({
  selector: 'app-dish',
  templateUrl: './dish.component.html',
  styleUrls: ['./dish.component.scss']
})
export class DishComponent  {

  status: boolean = false;
  clickClass() {
    this.status = !this.status;
  }

  clickButton() {

    console.log("Button action");
    
  }

}
