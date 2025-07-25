import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from './../services/storage.service'; // Adjust path to your service

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private storageService: StorageService, private router: Router) {}

  canActivate(): boolean {
    const user = this.storageService.getUser();
    
    // Check if roles exist and include admin
    if (user && user.roles && user.roles.includes('ROLE_ADMIN')) {
      return true;
    }

    // Not an admin → redirect to unauthorized page or home
    this.router.navigate(['/notfound']);
    return false;
  }
}
