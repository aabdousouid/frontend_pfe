import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { StorageService } from '../../../shared/services/storage.service';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { Access } from "../../auth/access";

@Component({
    selector: 'hero-widget',
    imports: [ButtonModule, RippleModule, RouterModule, DialogModule, CardModule, MessageModule],
    template: `
        <!-- <div
            id="hero"
            class="flex flex-col pt-6 px-6 lg:px-20 overflow-hidden"
            style="background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, rgb(238, 239, 175) 0%, rgb(195, 227, 250) 100%); clip-path: ellipse(150% 87% at 93% 13%)"
        >
            <div class="mx-6 md:mx-20 mt-0 md:mt-6">
                <h1 class="text-6xl font-bold text-gray-900 leading-tight"><span class="font-light block">Eu sem integer</span>eget magna fermentum</h1>
                <p class="font-normal text-2xl leading-normal md:mt-4 text-gray-700">Sed blandit libero volutpat sed cras. Fames ac turpis egestas integer. Placerat in egestas erat...</p>
                <button pButton pRipple [rounded]="true" type="button" label="Get Started" class="!text-xl mt-8 !px-4"></button>
            </div>
            <div class="flex justify-center md:justify-end">
                <img src="https://primefaces.org/cdn/templates/sakai/landing/screen-1.png" alt="Hero Image" class="w-9/12 md:w-auto" />
            </div>
        </div> -->
        
                
                <p-dialog [(visible)]="display" [breakpoints]="{ '960px': '75vw' }" [style]="{ width: '50%' }" [modal]="true">
                   
                   <!--  <p class="leading-normal m-0">
                       <p-message severity="error">LOGIN or SIGNUP to access the job portal.</p-message>
                    </p> -->
                    
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, rgba(247, 149, 48, 0.4) 10%, rgba(247, 149, 48, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20 flex flex-col items-center" style="border-radius: 53px">
                        <div class="gap-4 flex flex-col items-center">
                            <div class="flex justify-center items-center border-2 border-orange-500 rounded-full" style="width: 3.2rem; height: 3.2rem">
                                <i class="text-orange-500 pi pi-fw pi-lock !text-2xl"></i>
                            </div>
                            <h1 class="text-surface-900 dark:text-surface-0 font-bold text-4xl lg:text-5xl mb-2">Access Denied</h1>
                            <span class="text-muted-color mb-8">You do not have the necessary permisions. Please contact admins.</span>
                            <img src="https://primefaces.org/cdn/templates/sakai/auth/asset-access.svg" alt="Access denied" class="mb-8" width="80%" />
                            <div class="col-span-12 mt-8 text-center">
                                <p-button label="Go to Home" (click)="close()" severity="warn" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
       
                   <!--  <ng-template #footer>
                        <p-button label="close" (click)="close()" />
                    </ng-template> -->
                </p-dialog>
                
       

        <section class="py-20 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 text-center">
                <div class="max-w-4xl mx-auto">
                    <h1 class="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                        Bienvenue sur notre plateforme de
                        <span class="text-green-600 dark:text-green-400">Recrutement</span>
                    </h1>
                    <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                        Trouvez l'opportunité qui vous correspond parmi nos offres d'emploi et de stages. Postulez en ligne et suivez votre candidature.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <p-button 
                            (click)="navigateToJobs()"
                            label="Voir toutes les offres" 
                            icon="pi pi-search" 
                            size="small"
                            class="px-8 py-3" />
                        <p-button 
                            
                            label="Accéder à mon espace" 
                            icon="pi pi-lock" 
                            variant="outlined"
                            severity="secondary"
                            size="small"
                            class="px-8 py-3" />

                        <p-button 
                            
                            label="Besoin d'aide ?"
                            icon="pi pi-question-circle" 
                            severity="help"
                            variant="outlined"
                            size="small"
                            class="px-8 py-3" />
                    <!-- @if(isAdmin) {
                        <p-button 
                            label="Post a Job" 
                            icon="pi pi-plus" 
                            size="large"
                            [outlined]="true"
                            class="px-8 py-3" />}  -->
                    </div>
                    
                    <!-- Stats -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                        <div class="text-center">
                            <div class="text-3xl font-bold text-green-600 dark:text-green-400">50K+</div>
                            <div class="text-gray-600 dark:text-gray-300">Active Job Seekers</div>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl font-bold text-green-600 dark:text-green-400">2K+</div>
                            <div class="text-gray-600 dark:text-gray-300">Partner Companies</div>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl font-bold text-green-600 dark:text-green-400">95%</div>
                            <div class="text-gray-600 dark:text-gray-300">Success Rate</div>
                        </div>
                    </div>
                </div>
            </section>






    `
})
export class HeroWidget implements OnInit {
    display: boolean = false;
    isLoggedIn:Boolean = false;
    isAdmin:Boolean = false;
    user!:any;
    roles: string[] = [];
    constructor(private Router: Router,private storageService: StorageService) { 
        // Initialization logic if needed
    }
    ngOnInit(): void {
        this.isLoggedIn = this.storageService.isLoggedIn();
        this.user = this.storageService.getUser();
        this.roles = this.user?.roles || [];
       // console.log(this.user.roles);
        if(this.roles.includes('ROLE_ADMIN')){
        this.isAdmin = true;
        }else if(this.roles == null || this.roles.length == 0){
            this.isAdmin = false;}
        
    }
    navigateToJobs(){
        if (this.isLoggedIn) {
            this.Router.navigate(['/app/jobs']);
        } else {
            //this.open();
            this.Router.navigate(['/auth/access']);
            /* this.Router.navigate(['/login'], { queryParams: { returnUrl: '/app/jobs' } }); */
        }
    }

    open() {
        this.display = true;
    }
    close() {
        this.display = false;
    }
}
