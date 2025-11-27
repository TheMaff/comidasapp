import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';

import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ErrorHandlerService } from 'src/app/core/error-handling/error-handler.service';
import { passwordsMatchValidator } from 'src/app/shared/validators/password-match.validator';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  standalone: true, // 👈 CLAVE
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule
  ],
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent {

  loading = false;

  // Mantén tu constructor y form builder igual
  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirm: ['', [Validators.required]],
    remember: [true],
    terms: [false, [Validators.requiredTrue]]
  }, { validators: [passwordsMatchValidator('password', 'confirm')] });

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
    } finally {
      this.loading = false;
    }
  }
}