import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = this.authService.getToken();
    const tokenExpired = this.authService.isTokenExpired();
    const user = this.authService.getCurrentUser();

    if (!token || this.authService.isTokenExpired() || (user && user.validar)) {
      this.authService.logout();
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
