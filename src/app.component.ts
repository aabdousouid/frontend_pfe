import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { StorageService } from './app/shared/services/storage.service';
import { AuthService } from './app/shared/services/auth.service';
import { EventBusService } from './app/shared/event-bus.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { Login } from "./app/pages/auth/login";
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { SideChatComponent } from "./app/pages/chat/side-chat/side-chat.component";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, /* Login, */ CommonModule, SideChatComponent],
    template: `
    <!-- <div *ngIf="!isLoggedIn;else elseBlock">
        <app-login></app-login>
    </div>
    
    <ng-template #elseBlock> <router-outlet></router-outlet></ng-template> -->
   <app-side-chat></app-side-chat>
    <router-outlet></router-outlet >


    `
})
export class AppComponent implements OnInit{
    
    isLoggedIn = false;
    eventBusSub?: Subscription;
    constructor(private router:Router,private storageService:StorageService,private authService:AuthService,private eventBusService: EventBusService){

    }
    ngOnInit(): void {/* 
        this.isLoggedIn = this.storageService.isLoggedIn();
        console.log(this.isLoggedIn);
    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
      
    }

    this.eventBusSub = this.eventBusService.on('logout', () => {
      this.logout();
    }); */




    // Check login status on app initialization
    this.checkAuthStatus();
    
    // Listen to route changes to handle authentication
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.handleRouteChange(event.url);
    });
    
    this.eventBusSub = this.eventBusService.on('logout', () => {
            this.logout();
        });
    



    }

    logout(): void {
      
          this.storageService.clean();
  
          //window.location.reload();
          this.router.navigate(['/']);
    
    }

    private checkAuthStatus(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    
    // If not logged in and not on auth routes, redirect to login
    if (!this.isLoggedIn && !this.isOnAuthRoute()) {
      this.router.navigate(['/app']);
    }
  }



    private handleRouteChange(url: string): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    
    // If user is not logged in and trying to access protected routes
    if (!this.isLoggedIn && !this.isOnAuthRoute(url)) {
      this.router.navigate(['/app']);
    }
    
    // If user is logged in and on auth routes, redirect to dashboard
    if (this.isLoggedIn && this.isOnAuthRoute(url)) {
      this.router.navigate(['']);
    }
  }


  private isOnAuthRoute(url?: string): boolean {
    const currentUrl = url || this.router.url;
        const publicRoutes = ['/', '/landing', '/auth/login', '/auth/register', '/auth/access', '/auth/error'];
        return publicRoutes.some(route => 
            currentUrl === route || 
            (route.startsWith('/auth') && currentUrl.startsWith('/auth'))
        );

  }
}
