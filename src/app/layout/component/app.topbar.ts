import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { Menu } from 'primeng/menu';
import { StorageService } from '../../shared/services/storage.service';
import { BadgeModule } from 'primeng/badge';
import { NotificationService } from '../../shared/services/notification.service';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { PopoverModule } from 'primeng/popover';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [
        RouterModule, 
        CommonModule, 
        StyleClassModule, 
        ButtonModule, 
        AppConfigurator, 
        PopoverModule,
        Menu, 
        BadgeModule, 
        OverlayBadgeModule,
        OverlayPanelModule,
        ScrollPanelModule,
        AvatarModule,
        TagModule,
        ToastModule,
        TooltipModule
    ],
    template: `
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/">
                <img alt="logo" style="width: 40%;height:10%;" src="./../../../assets/images/thumbnail_image001.png"/>
            </a>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <div [style]="{'margin': '5%'}">
                    @if(this.role.includes('ROLE_ADMIN')){
                        <p-badge value="Administrateur" badgeSize="large" severity="success" />
                    }@else {
                        <p-badge value="Utilisateur" badgeSize="large" severity="info" />
                    }
                </div>
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>
                <div class="relative">
                    <app-configurator />
                </div>
            </div>

            <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <!-- Notification Bell -->
                    <button 
                        type="button" 
                        class="layout-topbar-action notification-bell" 
                        (click)="notificationPanel.toggle($event)"
                        pTooltip="Notifications"
                        tooltipPosition="bottom">
                        <p-overlaybadge 
                            [value]="notificationCount > 0 ? notificationCount.toString() : ''" 
                            severity="danger">
                            <i class="pi pi-bell" style="font-size: 1.2rem"></i>
                        </p-overlaybadge>
                    </button>

                    <!-- Notifications Panel -->
                    <p-popover 
                        #notificationPanel 
                        [style]="{'width': '380px', 'max-height': '500px'}"
                        styleClass="notification-overlay">
                        <ng-template pTemplate="content">
                            <div class="notification-header">
                                <div class="flex justify-content-between align-items-center p-3 border-bottom-1 surface-border">
                                    <h6 class="m-0 font-semibold">Notifications</h6>
                                    @if(notificationCount > 0) {
                                        <button 
                                            pButton 
                                            pRipple 
                                            type="button" 
                                            label="Marquer tout comme lu" 
                                            class="p-button-text p-button-sm"
                                            (click)="markAllAsRead()">
                                        </button>
                                    }
                                </div>
                            </div>
                            
                            <div class="notification-content">
                                @if(notifications.length === 0) {
                                    <div class="text-center p-4">
                                        <i class="pi pi-bell-slash text-4xl text-400 mb-3"></i>
                                        <p class="text-600 m-0">Aucune notification pour le moment</p>
                                    </div>
                                } @else {
                                    <p-scrollPanel [style]="{'width': '100%', 'height': '350px'}">
                                        <div class="notification-list">
                                            @for(notification of getDisplayNotifications(); track notification.notificationId) {
                                                <div 
                                                    class="notification-item flex p-3 border-bottom-1 surface-border cursor-pointer hover:surface-hover"
                                                    [class.unread]="!notification.isRead"
                                                    (click)="markAsRead(notification)">
                                                    
                                                    <div class="notification-avatar mr-3">
                                                        <p-avatar 
                                                            [icon]="getNotificationIcon(notification.type)" 
                                                            [style]="{'background-color': getNotificationColor(notification.type)}"
                                                            shape="circle" 
                                                            size="normal">
                                                        </p-avatar>
                                                    </div>
                                                    
                                                    <div class="notification-content flex-1">
                                                        <div class="flex justify-content-between align-items-start mb-1">
                                                            <h6 class="notification-title m-0 text-sm font-medium line-height-3">
                                                                {{ notification.title }}
                                                            </h6>
                                                            @if(!notification.isRead) {
                                                                <!-- <div class="unread-indicator bg-primaryf" 
                                                                     style="width: 8px; height: 8px; margin-top: 4px;"></div> -->
                                                                     <p-badge severity="success" > </p-badge>

                                                            }
                                                        </div>
                                                        
                                                        <p class="notification-message m-0 text-sm text-600 line-height-3 mb-2">
                                                            {{ notification.message }}
                                                        </p>
                                                        
                                                        <div class="flex justify-content-between align-items-center">
                                                            <small class="text-400">{{ getTimeAgo(notification.createdAt) }}</small>
                                                            <p-tag 
                                                                [value]="notification.type" 
                                                                [severity]="getTagSeverity(notification.type)"
                                                                class="text-xs">
                                                            </p-tag>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </p-scrollPanel>
                                    
                                    @if(notifications.length > 5) {
                                        <div class="text-center p-3 border-top-1 surface-border">
                                            <button 
                                                pButton 
                                                pRipple 
                                                type="button" 
                                                label="Afficher toutes les notifications" 
                                                class="p-button-text p-button-sm"
                                                (click)="viewAllNotifications()">
                                            </button>
                                        </div>
                                    }
                                }
                            </div>
                        </ng-template>
                    </p-popover>
                   
                    <button type="button" class="layout-topbar-action" (click)="menu.toggle($event)">
                        <i class="pi pi-user"></i>
                        <span>Profile</span>
                    </button>
                    <p-menu #menu [model]="items" [popup]="true" />
                </div>
            </div>
        </div>
    </div>
    <p-toast></p-toast>`,
    styles: `
        .notification-bell {
            position: relative;
        }
        
        .notification-overlay {
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            border-radius: 8px;
        }
        
        .notification-item {
            transition: background-color 0.2s;
        }
        
        .notification-item.unread {
            background-color: var(--primary-50);
            border-left: 3px solid var(--primary-color);
        }
        
        .notification-title {
            color: var(--text-color);
        }
        
        .notification-message {
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
        
        .unread-indicator {
            flex-shrink: 0;
        }
        
        .notification-avatar {
            flex-shrink: 0;
        }
    `,
    providers:[MessageService]
})
export class AppTopbar implements OnInit {
    items: MenuItem[] | undefined;
    isLoggedIn!: Boolean;
    role: string[];
    notificationCount: any = 0;
    notifications: any[] = [];
    showNotifications = false;
    socketClient :any = null;
    private notificationSubscription: any;

    constructor(
        public layoutService: LayoutService,
        private storageService: StorageService,
        private router: Router,
        private notificationService: NotificationService,
        private messageService:MessageService
    ) {
        this.role = this.storageService.getUser().roles;
    }
    
    ngOnInit(): void {
        this.loadNotifications();
        this.setupMenuItems();
        this.setupWebSocketConnection();
    }

    loadNotifications(): void {
        this.notificationService.getUserNotification().subscribe({
            next: ((data)=> {
                /* console.log("Notifications loaded:", data); */
                this.notifications = data;
                this.notificationCount = data.filter((n:any) => !n.isRead).length;
            }) 
        });
    }

    setupMenuItems(): void {
        this.items = [
            {
                label: '',
                items: [
                    {
                        label: 'Profile',
                        icon: 'pi pi-user',
                        routerLink: ['/app/profile'],
                    },
                    {
                        label: 'Logout',
                        icon: 'pi pi-sign-out',
                        command: () => {
                            this.logout();
                        }
                    }
                ]
            }
        ];
    }

    setupWebSocketConnection(): void {
        if(this.storageService.getUser().id){
           
            let ws = new SockJS('http://localhost:8080/ws');
            this.socketClient = Stomp.over(ws);

            this.socketClient.connect({'Authorization': 'Bearer'+this.storageService.getUser().accessToken},()=>{
                console.log("Connecting to WS ...");
                this.notificationSubscription = this.socketClient.subscribe(`/user/${this.storageService.getUser().username}/notifications`,
            (message:any)=>{
               // console.log("Received message:", message.body);
                const notification = JSON.parse(message.body);
                if(notification){
                    /* console.log("New notification:", notification); */
                    this.notificationCount++;
                    this.notifications.unshift(notification);
                    this.messageService.add({severity: 'info', summary: 'New Notification', detail: notification.message, life: 3000});
                    
                }
            })
            })
        }
    }

    getDisplayNotifications(): any[] {
        // Return only first 5 notifications for the dropdown
        return this.notifications.slice(0, 5);
    }

    getNotificationIcon(type: string): string {
        const iconMap: { [key: string]: string } = {
            'application': 'pi pi-file',
            'interview': 'pi pi-calendar',
            'job': 'pi pi-briefcase',
            'message': 'pi pi-envelope',
            'system': 'pi pi-cog',
            'default': 'pi pi-info-circle'
        };
        return iconMap[type] || iconMap['default'];
    }

    getNotificationColor(type: string): string {
        const colorMap: { [key: string]: string } = {
            'application': '#3B82F6',
            'interview': '#10B981',
            'job': '#8B5CF6',
            'message': '#F59E0B',
            'system': '#6B7280',
            'default': ''
        };
        return colorMap[type] || colorMap['default'];
    }

    getTagSeverity(type: string): string {
        const severityMap: { [key: string]: string } = {
            'application': 'info',
            'interview': 'success',
            'job': 'warning',
            'message': 'info',
            'system': 'secondary',
            'default': 'info'
        };
        return severityMap[type] || severityMap['default'];
    }

    getTimeAgo(date: Date | string): string {
        const now = new Date();
        const notificationDate = new Date(date);
        const diffInMs = now.getTime() - notificationDate.getTime();
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInDays < 7) return `${diffInDays}d ago`;
        return notificationDate.toLocaleDateString();
    }

    markAsRead(notification: any): void {
        console.log("Marking notification as read:", notification);
          if (!notification.isRead) {
            notification.isRead = true;
            this.notificationCount = this.notifications.filter(n => !n.read).length;
            
            // Call your service to mark as read in backend
            this.notificationService.markAsRead(notification.notificationId).subscribe({
                next: () => {
                    console.log(`Notification ${notification.notificationId} marked as read`);
                },
                error: (err) => {
                    console.error(`Error marking notification ${notification.id} as read`, err);
                }
            });
        }
        
        // Handle navigation based on notification type
        this.handleNotificationClick(notification); 
    }

    markAllAsRead(): void {
        this.notifications.forEach(notification => {
            if (!notification.isRead) {
                notification.isRead = true;
            }
        });
        this.notificationCount = 0;
        this.notificationService.markAllAsRead().subscribe({
            next:()=>{
                this.messageService.add({severity: 'success', summary: 'Notifications', detail: 'Toutes les notifications marquées comme lues'});
            },
            error:(err)=>{
                this.messageService.add({severity: 'error', summary: 'Error', detail: 'Impossible de marquer toutes les notifications comme lues'});
                console.error('Error marking all notifications as read:', err);
            }
        })
        // Call your service to mark all as read in backend
        //this.notificationService.markAllAsRead().subscribe();
    }

    handleNotificationClick(notification: any): void {
        // Navigate based on notification type
        switch (notification.type) {
            case 'application':
                this.router.navigate(['/app/applications', notification.relatedId]);
                break;
            case 'interview':
                this.router.navigate(['/app/interviews', notification.relatedId]);
                break;
            case 'job':
                this.router.navigate(['/app/jobs', notification.relatedId]);
                break;
            case 'message':
                this.router.navigate(['/app/messages', notification.relatedId]);
                break;
            default:
                // Handle default case or stay on current page
                break;
        }
    }

    viewAllNotifications(): void {
        this.router.navigate(['/app/notifications']);
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    logout() {
        this.storageService.clean();
        this.isLoggedIn = false;
        this.router.navigate(['/auth/login']);
    }
}