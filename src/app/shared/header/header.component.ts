import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  usuarioLogueado: boolean = false; // Aquí debes utilizar tu lógica para verificar si el usuario está logueado
  nombreUsuario: string = "Nombre del usuario"; // Aquí debes obtener el nombre del usuario logueado

  constructor(public auth: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  logout() { this.auth.logout().then(() => this.router.navigateByUrl('/login')); }


  irAConfiguracion() {
    console.log('// Lógica para redirigir a la página de configuración');
  }

}
