import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { faMoneyBillTransfer } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { Auth } from '../../core/services/auth';
import { InputComponent } from '../../shared/component/input/input';
import { FieldLabelComponent } from '../../shared/component/field-label/field-label';
import { ButtonComponent } from '../../shared/component/button/button';
import { PasswordInputComponent } from '../../shared/component/password-input/password-input';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FieldLabelComponent,
    InputComponent,
    PasswordInputComponent,
    ButtonComponent,
    FontAwesomeModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  faBrand = faMoneyBillTransfer;

  loading = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.toastr.warning('Please enter valid credentials');
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    try {
      const { email, password } = this.form.getRawValue();

      const success = this.authService.login(
        email ?? '',
        password ?? ''
      );

      if (!success) {
        throw new Error('Invalid email or password');
      }

      this.toastr.success('Login successful');
      await this.router.navigate(['/main']);

    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Something went wrong';

      this.toastr.error(message);
    } finally {
      this.loading = false;
    }
  }
}
