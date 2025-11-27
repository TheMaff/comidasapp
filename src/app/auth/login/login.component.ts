import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

// Material Modules (Reemplaza a SharedModule/MaterialModule)
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// Servicios
import { AuthService } from '../../services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { ErrorHandlerService } from 'src/app/core/error-handling/error-handler.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {
  // ... (Mantén el resto de tu lógica de clase exactamente igual)

  loading: boolean = false;
  // Usamos inject() o constructor, lo que prefieras, pero mantén tu lógica
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [true],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private errorHandler: ErrorHandlerService
  ) { }

  ngOnInit(): void { }

  async onSubmitEmail() {
    if (this.form.invalid) return;
    const { email, password } = this.form.value;

    try {
      this.loading = true;
      const cred = await this.authService.loginWithEmail(email!, password!);
      await this.userService.ensureProfile(cred.user);
      this.router.navigateByUrl('/dashboard');
    } catch (error: any) {
      this.errorHandler.handleFirebaseAuthError(error);
    } finally {
      this.loading = false;
    }
  }

  async loginWithGoogle() {
    try {
      this.loading = true;
      const cred = await this.authService.loginWithGoogle();
      await this.userService.ensureProfile(cred.user);
      this.router.navigateByUrl('/dashboard');
    } catch (e) {
      this.errorHandler.handleFirebaseAuthError(e);
    } finally {
      this.loading = false;
    }
  }

  async logout() {
    try {
      this.loading = true;
      await this.authService.logout();
      this.router.navigateByUrl('/login');
    } catch (e) {
      this.errorHandler.handleFirebaseAuthError(e);
    } finally {
      this.loading = false;
    }
  }

  async onForgotPassword() {
    const email = this.form.controls.email.value;
    if (!email) return;
    try {
      await this.authService.resetPassword(email);
    } catch (e) {
      this.errorHandler.handleFirebaseAuthError(e);
    }
  }
}