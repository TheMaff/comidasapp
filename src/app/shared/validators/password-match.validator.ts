// shared/validators/password-match.validator.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordsMatchValidator(
    passwordControlName: string,
    confirmControlName: string
): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
        const passwordControl = group.get(passwordControlName);
        const confirmControl = group.get(confirmControlName);

        if (!passwordControl || !confirmControl) return null;

        const password = passwordControl.value;
        const confirm = confirmControl.value;

        // dejamos que el required se encargue si está vacío
        if (!confirm) return null;

        // ya tiene otros errores (distintos de passwordMismatch) → no los pisamos
        if (confirmControl.errors && !confirmControl.errors['passwordMismatch']) {
            return null;
        }

        if (password !== confirm) {
            confirmControl.setErrors({
                ...(confirmControl.errors || {}),
                passwordMismatch: true
            });
            return { passwordMismatch: true };
        } else {
            // limpiamos solo la key passwordMismatch
            if (confirmControl.errors) {
                delete confirmControl.errors['passwordMismatch'];
                if (!Object.keys(confirmControl.errors).length) {
                    confirmControl.setErrors(null);
                }
            }
            return null;
        }
    };
}
