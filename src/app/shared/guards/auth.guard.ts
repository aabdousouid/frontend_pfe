// shared/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private storageService: StorageService, 
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.storageService.isLoggedIn()) {
      return true;
    } else {
      // Redirect to login with return url
      this.router.navigate(['/auth/access'], { 
        queryParams: { returnUrl: state.url } 
      });
      return false;
    }
  }
}