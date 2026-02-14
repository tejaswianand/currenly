import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environments } from '../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private readonly TOKEN_KEY = 'auth_token';

  constructor(private readonly router: Router) { }

  login(email: string, password: string): boolean {
    const isValid =
      email === environments.auth.email &&
      password === environments.auth.password;

    if (!isValid) return false;

    this.setToken(this.generateMockToken());
    return true;
  }

  logout(): void {
    this.clearToken();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  private generateMockToken(): string {
    return btoa(Date.now().toString());
  }
}
