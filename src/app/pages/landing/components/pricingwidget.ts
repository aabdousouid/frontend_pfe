import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';
import { TagModule } from 'primeng/tag';
import { JobsService } from '../../../shared/services/jobs.service';
import { CommonModule } from '@angular/common';
import { AnimateOnScroll } from 'primeng/animateonscroll';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'pricing-widget',
    imports: [DividerModule, ButtonModule, RippleModule,TagModule,CarouselModule,CardModule,CommonModule,AnimateOnScroll,RouterLink],
    template: `
        <!-- <div id="pricing" class="py-6 px-6 lg:px-20 my-2 md:my-6">
            <div class="text-center mb-6">
                <div class="text-surface-900 dark:text-surface-0 font-normal mb-2 text-4xl">Matchless Pricing</div>
                <span class="text-muted-color text-2xl">Amet consectetur adipiscing elit...</span>
            </div>

            <div class="grid grid-cols-12 gap-4 justify-between mt-20 md:mt-0">
                <div class="col-span-12 lg:col-span-4 p-0 md:p-4">
                    <div class="p-4 flex flex-col border-surface-200 dark:border-surface-600 pricing-card cursor-pointer border-2 hover:border-primary duration-300 transition-all" style="border-radius: 10px">
                        <div class="text-surface-900 dark:text-surface-0 text-center my-8 text-3xl">Free</div>
                        <img src="https://primefaces.org/cdn/templates/sakai/landing/free.svg" class="w-10/12 mx-auto" alt="free" />
                        <div class="my-8 flex flex-col items-center gap-4">
                            <div class="flex items-center">
                                <span class="text-5xl font-bold mr-2 text-surface-900 dark:text-surface-0">$0</span>
                                <span class="text-surface-600 dark:text-surface-200">per month</span>
                            </div>
                            <button pButton pRipple label="Get Started" class="p-button-rounded border-0 ml-4 font-light leading-tight bg-blue-500 text-white"></button>
                        </div>
                        <p-divider class="w-full bg-surface-200"></p-divider>
                        <ul class="my-8 list-none p-0 flex text-surface-900 dark:text-surface-0 flex-col px-8">
                            <li class="py-2">
                                <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                <span class="text-xl leading-normal">Responsive Layout</span>
                            </li>
                            <li class="py-2">
                                <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                <span class="text-xl leading-normal">Unlimited Push Messages</span>
                            </li>
                            <li class="py-2">
                                <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                <span class="text-xl leading-normal">50 Support Ticket</span>
                            </li>
                            <li class="py-2">
                                <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                <span class="text-xl leading-normal">Free Shipping</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="col-span-12 lg:col-span-4 p-0 md:p-4 mt-6 md:mt-0">
                    <div class="p-4 flex flex-col border-surface-200 dark:border-surface-600 pricing-card cursor-pointer border-2 hover:border-primary duration-300 transition-all" style="border-radius: 10px">
                        <div class="text-surface-900 dark:text-surface-0 text-center my-8 text-3xl">Startup</div>
                        <img src="https://primefaces.org/cdn/templates/sakai/landing/startup.svg" class="w-10/12 mx-auto" alt="startup" />
                        <div class="my-8 flex flex-col items-center gap-4">
                            <div class="flex items-center">
                                <span class="text-5xl font-bold mr-2 text-surface-900 dark:text-surface-0">$1</span>
                                <span class="text-surface-600 dark:text-surface-200">per month</span>
                            </div>
                            <button pButton pRipple label="Get Started" class="p-button-rounded border-0 ml-4 font-light leading-tight bg-blue-500 text-white"></button>
                        </div>
                        <p-divider class="w-full bg-surface-200"></p-divider>
                        <ul class="my-8 list-none p-0 flex text-surface-900 dark:text-surface-0 flex-col px-8">
                            <li class="py-2">
                                <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                <span class="text-xl leading-normal">Responsive Layout</span>
                            </li>
                            <li class="py-2">
                                <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                <span class="text-xl leading-normal">Unlimited Push Messages</span>
                            </li>
                            <li class="py-2">
                                <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                <span class="text-xl leading-normal">50 Support Ticket</span>
                            </li>
                            <li class="py-2">
                                <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                <span class="text-xl leading-normal">Free Shipping</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="col-span-12 lg:col-span-4 p-0 md:p-4 mt-6 md:mt-0">
                    <div class="p-4 flex flex-col border-surface-200 dark:border-surface-600 pricing-card cursor-pointer border-2 hover:border-primary duration-300 transition-all" style="border-radius: 10px">
                        <div class="text-surface-900 dark:text-surface-0 text-center my-8 text-3xl">Enterprise</div>
                        <img src="https://primefaces.org/cdn/templates/sakai/landing/enterprise.svg" class="w-10/12 mx-auto" alt="enterprise" />
                        <div class="my-8 flex flex-col items-center gap-4">
                            <div class="flex items-center">
                                <span class="text-5xl font-bold mr-2 text-surface-900 dark:text-surface-0">$5</span>
                                <span class="text-surface-600 dark:text-surface-200">per month</span>
                            </div>
                            <button pButton pRipple label="Try Free" class="p-button-rounded border-0 ml-4 font-light leading-tight bg-blue-500 text-white"></button>
                        </div>
                        <p-divider class="w-full bg-surface-200"></p-divider>
                        <ul class="my-8 list-none p-0 flex text-surface-900 dark:text-surface-0 flex-col px-8">
                            <li class="py-2">
                                <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                <span class="text-xl leading-normal">Responsive Layout</span>
                            </li>
                            <li class="py-2">
                                <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                <span class="text-xl leading-normal">Unlimited Push Messages</span>
                            </li>
                            <li class="py-2">
                                <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                <span class="text-xl leading-normal">50 Support Ticket</span>
                            </li>
                            <li class="py-2">
                                <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                <span class="text-xl leading-normal">Free Shipping</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div> -->



<section id="jobs" class="py-20 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20" pAnimateOnScroll
            enterClass="animate-enter fade-in-10 slide-in-from-l-8 animate-duration-1000"
            leaveClass="animate-leave fade-out-0">
                <div class="max-w-6xl mx-auto">
                    <div class="text-center mb-16">
                        <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Offres d'emploi
                        </h2>
                        <p class="text-xl text-gray-600 dark:text-gray-300">
                            Découvrez les opportunités de carrière au sein du groupe ACTIA, ACTIA ES, ACTIA AFRICA, CIPI ACTIA et plus encore.
                        </p>
                    </div>

                    <p-carousel 
                        [value]="jobs" 
                        [numVisible]="3" 
                        [numScroll]="1" 
                        [circular]="true"
                        [autoplayInterval]="3000"
                        [responsiveOptions]="responsiveOptions">
                        <ng-template let-job pTemplate="item">
                            <div class="p-4">
                                <p-card class="h-full">
                                    <ng-template pTemplate="header">
                                        <div class="p-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                                            <div class="flex items-center justify-between">
                                                <div>
                                                    <h3 class="text-xl font-bold mb-2">{{job.title}}</h3>
                                                    <p class="opacity-90">{{job.company}}</p>
                                                </div>
                                                <div class="text-right">
                                                    <i [class]="job.icon + ' text-3xl'"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </ng-template>
                                    
                                    <div class="p-6">
                                        <div class="flex items-center gap-2 mb-4">
                                            <i class="pi pi-map-marker text-green-600"></i>
                                            <span class="text-gray-600">{{job.location}}</span>
                                        </div>
                                        
                                        <div class="flex items-center gap-2 mb-4">
                                            <i class="pi pi-clock text-green-600"></i>
                                            <span class="text-gray-600">{{job.type}}</span>
                                        </div>

                                        <!-- <div class="flex items-center gap-2 mb-4">
                                            <i class="pi pi-dollar text-green-600"></i>
                                            <span class="text-gray-600">{{job.salary}}</span>
                                        </div> -->

                                        <p class="text-gray-700 dark:text-gray-300 mb-6">
                                            {{job.description}}
                                        </p>

                                        <div class="flex flex-wrap gap-2 mb-6">
                                            
                                            <p-tag 
                                                *ngFor="let skill of job.skills" 
                                                [value]="skill" 
                                                [rounded]="true"
                                                class="bg-green-100 text-green-800" />
                                            
                                        </div>

                                        <div class="flex justify-between items-center">
                                            <span class="text-sm text-gray-500">{{job.posted}}</span>
                                           <!--  <p-button 
                                                label="Apply Now" 
                                                icon="pi pi-send"
                                                size="small"
                                                class=" border-green-600 hover:green-700" /> -->
                                        </div>
                                    </div>
                                </p-card>
                            </div>
                        </ng-template>
                    </p-carousel>

                    <div class="text-center mt-12">
                        <p-button 
                            label="Voir toutes les offres" 
                            icon="pi pi-arrow-right" 
                            size="large"
                            routerLink="/app/jobs"
                            [outlined]="true"
                            class="border-green-600 text-green-600 px-8 py-3" />
                    </div>
                </div>
            </section>

    `
})
export class PricingWidget implements OnInit {

    constructor(private jobService:JobsService) { }

    jobsList:any=[];

    ngOnInit(): void {
       /* this.jobService.getAllJobs().subscribe({
            next: (data) => {
                //this.jobsList = data;
                console.log(this.jobsList);
            }
        }); */
    } 


jobs = [
        {
            title: 'Senior Software Engineer',
            company: 'ACTIA ES',
            location: 'Arianna',
            type: 'Full-time',
           /*  salary: '$120,000 - $150,000', */
            description: 'Rejoignez notre équipe innovante pour créer des applications web de pointe en utilisant des technologies modernes.',
            skills: ['Angular', 'TypeScript', 'Node.js', 'MongoDB'],
            posted: '2 days ago',
            icon: 'pi pi-code'
        },
        {
            title: 'UX/UI Designer',
            company: 'ACTIA ES',
            location: 'Arianna',
            type: 'Full-time',
            /* salary: '$80,000 - $100,000', */
            description: 'Créer des UX raffinées et intuitives pour nos produits et plateformes numériques.',
            skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
            posted: '1 day ago',
            icon: 'pi pi-palette'
        },
        {
            title: 'Product Manager',
            company: 'ACTIA ES',
            location: 'Charguia',
            type: 'Full-time',
            /* salary: '$110,000 - $130,000', */
            description: 'Diriger la stratégie produit et travailler avec des équipes interfonctionnelles pour fournir des produits exceptionnels.',
            skills: ['Strategy', 'Analytics', 'Agile', 'Leadership'],
            posted: '3 days ago',
            icon: 'pi pi-briefcase'
        },
        {
            title: 'Data Scientist',
            company: 'ACTIA ES',
            location: 'Arianna',
            type: 'Full-time',
           /*  salary: '$130,000 - $160,000', */
            description: 'Analyser des ensembles de données complexes et construire des modèles d"apprentissage automatique afin d"obtenir des informations commerciales.',
            skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow'],
            posted: '1 week ago',
            icon: 'pi pi-chart-bar'
        },
        {
            title: 'DevOps Engineer',
            company: 'ACTIA ES.',
            location: 'Remote',
            type: 'Full-time',
           /*  salary: '$100,000 - $125,000', */
            description: 'Gérer l"infrastructure cloud et mettre en œuvre des pipelines CI/CD pour des applications évolutives.',
            skills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins'],
            posted: '4 days ago',
            icon: 'pi pi-cloud'
        },
        /* {
            title: 'Marketing Manager',
            company: 'GrowthCo',
            location: 'Chicago, IL',
            type: 'Full-time',
            salary: '$70,000 - $90,000',
            description: 'Develop and execute marketing strategies to drive brand awareness and customer acquisition.',
            skills: ['Digital Marketing', 'SEO', 'Content Strategy', 'Analytics'],
            posted: '5 days ago',
            icon: 'pi pi-megaphone'
        } */
    ];

    responsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '768px',
            numVisible: 1,
            numScroll: 1
        }
    ];

}
