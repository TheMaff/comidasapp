// auth.guard.ts
import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';

export const authGuard: CanActivateFn = async () => {
    const auth = inject(Auth);
    const router = inject(Router);
    const user = auth.currentUser ?? await new Promise(res => {
        const unsub = auth.onAuthStateChanged(u => { unsub(); res(u); });
    });
    if (!user) { router.navigateByUrl('/login'); return false; }
    return true;
};
