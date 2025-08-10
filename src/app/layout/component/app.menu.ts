import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, Router, RouterModule } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { StorageService } from '../../shared/services/storage.service';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule,ToastModule,MessageModule],
    template: `
    <p-toast></p-toast>
    <ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `,
    providers: [MessageService]
})
export class AppMenu {
    model: MenuItem[] = [];
    isLoggedIn!:Boolean;

    isAdmin:boolean=false;
    roles:string[];
    userType:string='';
    constructor(private storageService: StorageService,private messageService:MessageService,private router:Router){
        this.roles = this.storageService.getUser().roles || [];
    }

    checkRoles():boolean{
        if(this.roles.includes('ROLE_ADMIN')) {
        return this.isAdmin=true;}
            else return this.isAdmin;

    }

    ngOnInit() {
        //check userType
        if(this.roles.includes('ROLE_ADMIN')) {
            this.userType = 'admin';}
            else this.userType = 'user';



        const candidatureLabel = this.userType === 'admin' ? 'Les Candidatures' : 'Mes Candidatures';
        const routePath = this.userType === 'admin' ? '/app/applications' : '/app/userApplications/' + this.storageService.getUser().id;
        this.model = [
            {
                label: 'Accueil',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/app/'] }]
            },
            {
                label: 'Gestion',
                items: [
                    { label: candidatureLabel, icon: 'pi pi-fw pi-id-card', routerLink: [routePath]},
                    { label: 'Offres d\'emploi', icon: 'pi pi-fw pi-briefcase', routerLink: ['/app/jobs'] },
                    { label: 'Recommandations', icon: 'pi pi-fw pi-comments', routerLink: ['/app/chatbot'] },
                    { label: 'Reclamations', icon: 'pi pi-fw pi-flag-fill', routerLink: ['/app/complaints-admin'],visible:this.checkRoles()==true },
                    { label: 'Mes Reclamations', icon: 'pi pi-fw pi-flag-fill', routerLink: ['/app/complaints-user'],visible:this.checkRoles()==false },/* 
                    { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', routerLink: ['/app/uikit/formlayout'] },
                    { label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/app/uikit/input'] },
                    { label: 'Button', icon: 'pi pi-fw pi-mobile', class: 'rotated-icon', routerLink: ['/app/uikit/button'] },
                    { label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/app/uikit/table'] },
                    { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/app/uikit/list'] },
                    { label: 'Tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/app/uikit/tree'] },
                    { label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/app/uikit/panel'] },
                    { label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/app/uikit/overlay'] }, */
                    { label: 'Media', icon: 'pi pi-fw pi-image', routerLink: ['/app/uikit/media'] },
                    /* { label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/app/uikit/menu'] },
                    { label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/app/uikit/message'] },
                    { label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/app/uikit/file'] },
                    { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/app/uikit/charts'] },
                    { label: 'Timeline', icon: 'pi pi-fw pi-calendar', routerLink: ['/app/uikit/timeline'] },
                    { label: 'Misc', icon: 'pi pi-fw pi-circle', routerLink: ['/app/uikit/misc'] }*/
                ] 
            },
            {
                label: 'Pages',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/pages'],
                items: [
                    {
                        label: 'Landing',
                        icon: 'pi pi-fw pi-globe',
                        routerLink: ['/landing']
                    },
                    /* {
                        label: 'Auth',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            {
                                label: 'Login',
                                icon: 'pi pi-fw pi-sign-in',
                                routerLink: ['/auth/login']
                            },
                            {
                                label: 'Error',
                                icon: 'pi pi-fw pi-times-circle',
                                routerLink: ['/auth/error']
                            },
                            {
                                label: 'Access Denied',
                                icon: 'pi pi-fw pi-lock',
                                routerLink: ['/auth/access']
                            }
                        ]
                    }, */
                   /*  {
                        label: 'Crud',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/app/pages/crud']
                    },
                    {
                        label: 'Not Found',
                        icon: 'pi pi-fw pi-exclamation-circle',
                        routerLink: ['/pages/notfound']
                    },
                    {
                        label: 'Empty',
                        icon: 'pi pi-fw pi-circle-off',
                        routerLink: ['/app/pages/empty']
                    } */
                ]
            },
            /* {
                label: 'Hierarchy',
                items: [
                    {
                        label: 'Submenu 1',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 1.1',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
                                ]
                            },
                            {
                                label: 'Submenu 1.2',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
                            }
                        ]
                    },
                    {
                        label: 'Submenu 2',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 2.1',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
                                ]
                            },
                            {
                                label: 'Submenu 2.2',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
                            }
                        ]
                    }
                ]
            }, */
            {
                label: 'Settings',
                items: [
                    {
                        label: 'Documentation',
                        icon: 'pi pi-fw pi-book',
                        routerLink: ['/documentation']
                    },
                    {
                        label: 'Logout',
                        icon: 'pi pi-fw pi-sign-out',
                        command:()=> {

                                this.storageService.clean(); // Clear token & user data from localStorage
                                this.isLoggedIn = false;     // Update the component's auth state
                                this.router.navigate(['/auth/login']); // Redirect to login

                                this.messageService.add({
                                    severity: 'info',
                                    summary: 'Logged out',
                                    detail: 'You have been successfully logged out'
                                });

                        }
                        
                    }
                ]
            }
        ];
    }

    /* logout(): void {
  this.storageService.clean(); 
  this.isLoggedIn = false;     
  this.router.navigate(['/login']); 

  this.messageService.add({
    severity: 'info',
    summary: 'Logged out',
    detail: 'You have been successfully logged out'
  });
} */
}
