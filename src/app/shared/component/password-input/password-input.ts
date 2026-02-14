import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-password-input',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  templateUrl: './password-input.html',
  styleUrls: ['./password-input.css'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class PasswordInputComponent {
  @Input() placeholder = '';
  @Input() controlName = '';

  showPassword = false;

  faEye = faEye;
  faEyeSlash = faEyeSlash;

  toggleVisibility() {
    this.showPassword = !this.showPassword;
  }
}
