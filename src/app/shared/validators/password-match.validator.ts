// src/app/shared/validators/password-match.validator.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador que verifica si dos campos específicos de un FormGroup coinciden.
 * Implementa el patrón de Validador Puro (solo retorna el error, no muta controles).
 */
export function passwordsMatchValidator(
    passwordControlName: string,
    confirmPasswordControlName: string
): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
        const passwordControl = group.get(passwordControlName);
        const confirmPasswordControl = group.get(confirmPasswordControlName);

        // Si los controles no existen o la confirmación no tiene valor, no validamos.
        if (!passwordControl || !confirmPasswordControl || !confirmPasswordControl.value) {
            return null;
        }

        // Si no coinciden los valores
        if (passwordControl.value !== confirmPasswordControl.value) {
            // RETORNA el error en el grupo. NO uses setErrors() aquí.
            return { passwordsMismatch: true };
        }

        // Si todo coincide
        return null;
    };
}