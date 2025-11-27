import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';

export const publicGuard: CanActivateFn = async () => {
    const auth = inject(Auth);
    const router = inject(Router);

    // Esperamos a que Firebase determine si hay sesión o no
    const user = auth.currentUser ?? await new Promise(res => {
        const unsub = auth.onAuthStateChanged(u => { unsub(); res(u); });
    });

    // 🚨 LÓGICA INVERSA:
    // Si HAY usuario logueado -> Lo mandamos al Dashboard y BLOQUEAMOS el acceso al Login.
    if (user) {
        router.navigateByUrl('/dashboard');
        return false;
    }

    // Si NO hay usuario -> Dejamos pasar (para que vea el Login/Registro).
    return true;
};