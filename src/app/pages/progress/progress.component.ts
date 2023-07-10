import { Component } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styles: [
  ]
})
export class ProgressComponent  {

  progreso: number = 20;

  get getPorcentaje() {
    return `${this.progreso}%`;
  }


  cambiarValor(valor: number) {

    if (this.progreso >= 100 && valor >= 0) {
      this.progreso = 100;
      return
    }
    
    if (this.progreso <= 0 && valor < 0) {
      this.progreso = 0;
      return
    }

    this.progreso = this.progreso + valor;
  }

}
