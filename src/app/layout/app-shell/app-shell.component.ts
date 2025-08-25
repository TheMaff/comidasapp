import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss']
})
export class AppShellComponent {
  @ViewChild('drawer') drawer!: MatSidenav;

  menu = [
    { icon: 'event', label: 'Planificador', link: '/dashboard' },
    { icon: 'list', label: 'Recetas', link: '/recipes' },
    { icon: 'shopping_cart', label: 'Lista de compras', link: '/shopping' },
    { icon: 'person', label: 'Perfil', link: '/profile' },
  ];

  closeOnMobile() { if (window.innerWidth < 992) this.drawer.close(); } // <992px ~ lg
}
