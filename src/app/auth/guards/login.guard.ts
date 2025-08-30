import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/app']);
      return false;
    }
    return true;
  }
}
