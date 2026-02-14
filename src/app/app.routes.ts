import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Main } from './features/main/main';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'main', component: Main, canActivate: [authGuard] },
    { path: '**', redirectTo: 'login' }
];
