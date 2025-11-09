import { Component, OnInit } from '@angular/core';
import { StyleClassModule } from 'primeng/styleclass';
import { Router, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../../shared/services/storage.service';

@Component({
    selector: 'topbar-widget',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule, 
        StyleClassModule, 
        ButtonModule, 
        RippleModule, 
        AvatarModule, 
        MenuModule
    ],
    template: `
        <nav class="flex items-center justify-between py-6 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 relative">
            <div class="flex items-center gap-2">
                <img alt="logo" class="h-24 w-auto object-contain" src="./../../../assets/images/aactia.png"/>
            </div>
            
            <div class="hidden md:flex items-center gap-8">
                @if(!isLoggedIn) {
                    <p-button 
                        label="Se Connecter" 
                        icon="pi pi-sign-in" 
                        class="ml-4" 
                        [outlined]="true" 
                        (onClick)="navigateToLogin()"
                    />
                } @else {
                    <!-- User Profile Section -->
                    <div class="flex items-center gap-4 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full border-2 border-green-200 dark:border-green-700">
                        <p-avatar 
                            [label]="userInitials" 
                            styleClass="bg-green-600 text-white"
                            shape="circle"
                            size="large"
                        />
                        <div class="flex flex-col">
                            <span class="text-sm font-semibold text-gray-800 dark:text-white">
                                {{ userName }}
                            </span>
                            <span class="text-xs text-green-600 dark:text-green-400">
                                Connecté
                            </span>
                        </div>
                        <p-button 
                            icon="pi pi-sign-out" 
                            [rounded]="true"
                            [text]="true"
                            severity="danger"
                            (onClick)="logout()"
                            pTooltip="Déconnexion"
                            tooltipPosition="bottom"
                        />
                    </div>
                }
            </div>
            
            <!-- Mobile Menu -->
            <div class="md:hidden">
                @if(!isLoggedIn) {
                    <p-button 
                        icon="pi pi-sign-in" 
                        [text]="true" 
                        (onClick)="navigateToLogin()"
                    />
                } @else {
                    <div class="flex items-center gap-2">
                        <p-avatar 
                            [label]="userInitials" 
                            styleClass="bg-green-600 text-white"
                            shape="circle"
                        />
                        <p-button 
                            icon="pi pi-sign-out" 
                            [rounded]="true"
                            [text]="true"
                            severity="danger"
                            (onClick)="logout()"
                        />
                    </div>
                }
            </div>
        </nav>
    `
})
export class TopbarWidget implements OnInit {
    isLoggedIn: boolean = false;
    userName: string = 'Utilisateur';
    userInitials: string = 'U';

    constructor(
        public router: Router,
        private storageService: StorageService
    ) {
        this.isLoggedIn = this.storageService.isLoggedIn();
    }

    ngOnInit(): void {
        console.log(this.isLoggedIn);
        if (this.isLoggedIn) {
            this.loadUserInfo();
        }
    }

    loadUserInfo(): void {
       
        const user = this.storageService.getUser();
        
        if (user) {
            this.userName = user.username || user.name || user.email || 'Utilisateur';
            this.userInitials = this.getInitials(this.userName);
        }
    }

    getInitials(name: string): string {
        const names = name.split(' ');
        if (names.length >= 2) {
            return (names[0][0] + names[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    navigateToLogin(): void {
        this.router.navigate(['/auth/login']);
    }

    logout(): void {
        this.storageService.clean();
        this.isLoggedIn = false;
        this.router.navigate(['/auth/login']);
        console.log('User logged out');
    }
}