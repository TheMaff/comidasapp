import { Component, ViewChild, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs';
import { filter, withLatestFrom } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

const DESKTOP_QUERY = '(min-width: 992px)'; // breakpoint Bootstrap "lg"

@Component({
  selector: 'app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss']
})
export class AppShellComponent {
  @ViewChild('drawer') drawer!: MatSidenav;

  private bo = inject(BreakpointObserver);
  private router = inject(Router);

  // true en desktop, false en mobile/tablet
  isDesktop$ = this.bo.observe(DESKTOP_QUERY).pipe(
    map(r => r.matches),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  isDesktop = false;

  private sub = new Subscription();

  menu = [
    { icon: 'event', label: 'Planificador', link: '/dashboard' },
    { icon: 'list', label: 'Recetas', link: '/recipes' },
    { icon: 'shopping_cart', label: 'Lista de compras', link: '/shopping' },
    { icon: 'person', label: 'Perfil', link: '/profile' },
  ];

  ngAfterViewInit() {
    // Mantén un booleano sincronizado
    this.sub.add(this.isDesktop$.subscribe(v => this.isDesktop = v));

    // En mobile, cierra al navegar
    this.sub.add(
      this.router.events.pipe(
        filter(e => e instanceof NavigationEnd),
        withLatestFrom(this.isDesktop$),
        filter(([_, isDesktop]) => !isDesktop)
      ).subscribe(() => this.drawer?.close())
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  // Abrir/cerrar según el modo actual
  openMenu() { this.drawer.open(); }
  closeMenu() { this.drawer.close(); }
  toggleMenu() { this.drawer.toggle(); }

  // closeOnMobile() { if (window.innerWidth < 992) this.drawer.close(); } // <992px ~ lg

  onNavListClick() {
    if (!this.isDesktop) this.closeMenu();
  }
}
