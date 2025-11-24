import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador que verifica si los campos 'password' y 'confirm' de un FormGroup coinciden.
 * @returns ValidationErrors si no coinciden, o null si son válidos.
 */
export function passwordsMatchValidator(
    passwordControlName: string,
    confirmPasswordControlName: string
): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
        const passwordControl = group.get(passwordControlName);
        const confirmPasswordControl = group.get(confirmPasswordControlName);

        // 1. Verificaciones de existencia
        if (!passwordControl || !confirmPasswordControl || !confirmPasswordControl.value) {
            return null;
        }

        if (confirmPasswordControl.errors && !confirmPasswordControl.errors['passwordMismatch']) {
            // otro validador ya puso un error, no lo pisamos
            return null;
        }

        // 2. Lógica de error: Si no coinciden, devuelve el error en el grupo.
        if (passwordControl.value !== confirmPasswordControl.value) {
            // Devolvemos el error en el grupo. Angular lo propagará al control hijo (confirmPasswordControl) 
            // si usamos un componente de validación de terceros, o lo manejamos manualmente en el template.
            return { passwordsMismatch: true };
        }

        if (passwordControl !== confirmPasswordControl) {
            confirmPasswordControl.setErrors({ passwordMismatch: true });
            return { passwordMismatch: true };
        } else {
            confirmPasswordControl.setErrors(null);
            return null;
        }

        // 3. Si coinciden, devuelve null.
        return null;
    };
}