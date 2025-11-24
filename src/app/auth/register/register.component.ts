//register.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { passwordsMatchValidator } from 'src/app/shared/validators/password-match.validator';

import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ErrorHandlerService } from 'src/app/core/error-handling/error-handler.service';
import { group } from '@angular/animations';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent {

  loading = false;
  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirm: ['', [Validators.required]],
    remember: [true],
    terms: [false, [Validators.requiredTrue]]
  }, { validators: [passwordsMatchValidator] });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private users: UserService,
    private errorHandler: ErrorHandlerService,
    private router: Router
  ) { }

  async onSubmit() {
    if (this.form.invalid) return;
    const { name, email, password } = this.form.value;
    try {
      this.loading = true;
      const cred = await this.auth.registerWithEmail(name!, email!, password!);
      await this.users.ensureProfile(cred.user);
      this.router.navigateByUrl('/dashboard');
    } catch (error: any) {
      this.errorHandler.handleFirebaseAuthError(error);
      console.error(error);
    } finally {
      this.loading = false;
    }
  }
}