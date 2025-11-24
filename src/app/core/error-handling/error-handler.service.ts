import { Injectable, ErrorHandler, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements ErrorHandler {

    constructor(private snackBar: MatSnackBar, private ngZone: NgZone) {}

  /**
   * Muestra un mensaje de error genérico al usuario.
   */
  showError(message: string, action: string = 'Cerrar', duration = 5000): void {
    this.snackBar.open(message, action, {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['snackbar-error'] 
    });
  }

    handleError(error: unknown): void {
        // log para el desarrollador
        console.error('🔴 Global Error Capturado (Runtime):', error);

        this.ngZone.run(() => {
            if (this.isFirebaseError(error)) {
                this.handleFirebaseAuthError(error);
                return;
            }

            // Error genérico no-Firebase
            this.showError('Ocurrió un error inesperado. Intenta nuevamente.');
        });
    }

  /**
   * Mapea códigos típicos de Firebase Auth a mensajes legibles.
   */
  handleFirebaseAuthError(error: unknown): void {
    // Por si viene como string, Error o FirebaseError
    const code = this.extractFirebaseCode(error);

    const message = this.mapFirebaseCodeToMessage(code);
    this.showError(message);
  }

  // --- privados ---

    private isFirebaseError(error: unknown): error is { code: string } {
        return !!(error as any)?.code;
    }
  private extractFirebaseCode(error: unknown): string {
    if (!error) {
      return 'unknown';
    }

    // FirebaseError suele tener `code`
    const asAny = error as any;
    if (asAny.code && typeof asAny.code === 'string') {
      return asAny.code;
    }

    return 'unknown';
  }

  private mapFirebaseCodeToMessage(code: string): string {
    switch (code) {
      case 'auth/user-not-found':
        return 'No existe un usuario con ese correo.';
      case 'auth/wrong-password':
        return 'La contraseña no es correcta.';
      case 'auth/invalid-email':
        return 'El formato del correo no es válido.';
      case 'auth/email-already-in-use':
        return 'Ese correo ya está registrado.';
      case 'auth/too-many-requests':
        return 'Demasiados intentos fallidos. Inténtalo de nuevo más tarde.';
      default:
        return 'Ocurrió un error inesperado. Intenta nuevamente.';
    }
  }
}
