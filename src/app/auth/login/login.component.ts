//login.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { ErrorHandlerService } from 'src/app/core/error-handling/error-handler.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  loading: boolean = false;

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

  ngOnInit(): void {

  }

  async onSubmitEmail() {
    if (this.form.invalid) return;
    const { email, password } = this.form.value;

    try {
      this.loading = true;
      const cred = await this.authService.loginWithEmail(email!, password!);
      await this.userService.ensureProfile(cred.user); // por si no existía
      this.router.navigateByUrl('/dashboard');
    } catch (error: any) {
      // TODO: mostrar snackbar con mensajes por código (auth/wrong-password, etc.)
      this.errorHandler.handleFirebaseAuthError(error);
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  async loginWithGoogle() {
    try {
      this.loading = true;
      const cred = await this.authService.loginWithGoogle();
      await this.userService.ensureProfile(cred.user);

      console.log('User logged in:', cred.user);
      this.router.navigateByUrl('/dashboard');
    } catch (e) {
      this.errorHandler.handleFirebaseAuthError(e);
      console.error('Login error:', e);
    } finally {
      this.loading = false;
    }
  }

  async logout() {
    try {
      this.loading = true;
      await this.authService.logout();
      console.log('User logged out');
      this.router.navigateByUrl('/login');
    } catch (e) {
      this.errorHandler.handleFirebaseAuthError(e);
      console.error('Logout error:', e);
    } finally {
      this.loading = false;
    }
  }

  async onForgotPassword() {
    const email = this.form.controls.email.value;
    if (!email) return; // pide email primero
    try {
      await this.authService.resetPassword(email);
      console.log('Password reset email sent to:', email);
      // Aquí podrías mostrar un snackbar o alerta al usuario

    }catch (e) {
      this.errorHandler.handleFirebaseAuthError(e);
      console.error(e);
    }
  }

}
