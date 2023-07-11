import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  usuarioLogueado: boolean = false; // Aquí debes utilizar tu lógica para verificar si el usuario está logueado
  nombreUsuario: string = "Nombre del usuario"; // Aquí debes obtener el nombre del usuario logueado

  constructor() { }

  ngOnInit(): void {
  }


  irAConfiguracion() {
    console.log('// Lógica para redirigir a la página de configuración');
  }

}
