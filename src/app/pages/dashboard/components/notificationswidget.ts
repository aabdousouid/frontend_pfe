import { Component, Input, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { NotificationService } from '../../../shared/services/notification.service';
import { CommonModule } from '@angular/common';


interface GroupedNotifications {
    group: string;
    items: any[];
    showAll: boolean;
}


@Component({
    standalone: true,
    selector: 'app-notifications-widget',
    imports: [ButtonModule, MenuModule,CommonModule],
    template: `<div class="card">
    <div class="flex items-center justify-between mb-6">
        <div class="font-semibold text-xl">Notifications</div>
        <div>
            <button pButton type="button" icon="pi pi-ellipsis-v"
                    class="p-button-rounded p-button-text p-button-plain"
                    (click)="menu.toggle($event)"></button>
            <p-menu #menu [popup]="true" [model]="items"></p-menu>
        </div>
    </div>

    <ng-container *ngFor="let group of groupedNotifications">
        <span class="block text-muted-color font-medium mb-4">{{ group.group.toUpperCase() }}</span>
        <ul class="p-0 m-0 list-none mb-6">
            <li *ngFor="let notif of group.showAll ? group.items : (group.items | slice:0:3)" class="flex items-center py-2 border-b border-surface">
                <div class="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-full mr-4 shrink-0">
                    <i class="pi pi-bell !text-xl text-blue-500"></i>
                </div>
                <span class="text-surface-900 dark:text-surface-0 leading-normal">
                    {{ notif.message }}
                    <span class="block text-xs text-muted-color mt-1">{{ notif.createdAt | date:'shortTime' }}</span>
                </span>
            </li>
        </ul>
        <!-- Show button only if there are more than 3 notifications and not showing all -->
        <div *ngIf="group.items.length > 3 && !group.showAll" class="mb-4 text-center">
            <button pButton type="button" label="Afficher toutes les notifications" class="p-button-text"
                    (click)="showAllForGroup(group)">
            </button>
        </div>
         <!-- Show button only if there are more than 3 notifications and not showing all -->
        <div *ngIf="group.showAll" class="mb-4 text-center">
            <button pButton type="button" label="Afficher moins de notifications" class="p-button-text"
                    (click)="showAllForGroup(group)">
            </button>
        </div>
    </ng-container>
    <div *ngIf="!groupedNotifications.length" class="text-center text-muted-color py-8">
        Aucune notification pour le moment.
    </div>
</div>

`
})
export class NotificationsWidget implements OnInit {
    notifications: any[] = [];
    groupedNotifications: GroupedNotifications[] = [];
    items = [
        { label: 'Add New', icon: 'pi pi-fw pi-plus' },
        { label: 'Remove', icon: 'pi pi-fw pi-trash' }
    ];

    constructor(private notificationService: NotificationService) {}

    ngOnInit(): void {
        this.loadNotifications();
    }

    loadNotifications(): void {
        this.notificationService.getUserNotification().subscribe({
            next: (data) => {
                this.notifications = data;
                this.groupedNotifications = this.groupByDate(this.notifications);
            }
        });
    }

    groupByDate(notifications: any[]): GroupedNotifications[] {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        function isSameDay(a: Date, b: Date) {
            return a.getFullYear() === b.getFullYear() &&
                a.getMonth() === b.getMonth() &&
                a.getDate() === b.getDate();
        }

        const groups: { [key: string]: any[] } = {
            'Today': [],
            'Yesterday': [],
            'Earlier': []
        };

        notifications.forEach(n => {
            const notifDate = new Date(n.createdAt);
            if (isSameDay(notifDate, today)) {
                groups['Today'].push(n);
            } else if (isSameDay(notifDate, yesterday)) {
                groups['Yesterday'].push(n);
            } else {
                groups['Earlier'].push(n);
            }
        });

        // Return with showAll toggle for each group
        return [
            { group: 'Today', items: groups['Today'], showAll: false },
            { group: 'Yesterday', items: groups['Yesterday'], showAll: false },
            { group: 'Earlier', items: groups['Earlier'], showAll: false }
        ].filter(g => g.items.length > 0);
    }

    showAllForGroup(group: GroupedNotifications) {
        group.showAll = !group.showAll;
    }
}
