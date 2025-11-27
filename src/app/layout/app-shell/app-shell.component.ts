import { Component, ViewChild, inject, OnDestroy, AfterViewInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map, shareReplay, filter, withLatestFrom } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

// Servicios
import { AuthService } from 'src/app/services/auth.service'; // Asegúrate de la ruta correcta

const DESKTOP_QUERY = '(min-width: 992px)'; // breakpoint "lg"

@Component({
  selector: 'app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss']
})
export class AppShellComponent implements AfterViewInit, OnDestroy {
  @ViewChild('drawer') drawer!: MatSidenav;

  private bo = inject(BreakpointObserver);
  private router = inject(Router);

  // 1. Inyectamos AuthService
  public auth = inject(AuthService);

  // 2. Observable del usuario actual (para usar con Async Pipe en HTML)
  // Mapeamos para obtener el nombre o un default
  userName$ = this.auth.user$.pipe(
    map(user => user?.displayName || user?.email?.split('@')[0] || 'Chef')
  );

  // Avatar dinámico (o default de GitHub si no tiene foto)
  userPhoto$ = this.auth.user$.pipe(
    map(user => user?.photoURL || 'https://github.com/github.png')
  );

  // Lógica de Responsive (igual que antes)
  isDesktop$ = this.bo.observe(DESKTOP_QUERY).pipe(
    map(r => r.matches),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  isDesktop = false;
  private sub = new Subscription();

  menu = [
    { icon: 'dashboard_2', label: 'Dashboard', link: '/dashboard' },
    { icon: 'dinner_dining', label: 'Platos', link: '/dishes' },
    { icon: 'event', label: 'Planificador', link: '/planner' },
    { icon: 'shopping_cart', label: 'Lista de compras', link: '/shopping-list' },
    { icon: 'person', label: 'Perfil', link: '/profile' },
  ];

  ngAfterViewInit() {
    this.sub.add(this.isDesktop$.subscribe(v => this.isDesktop = v));

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

  openMenu() { this.drawer.open(); }
  closeMenu() { this.drawer.close(); }
  toggleMenu() { this.drawer.toggle(); }

  // 3. Método Logout Real
  async logout() {
    try {
      await this.auth.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error cerrando sesión', error);
    }
  }
}