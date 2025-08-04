import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

@Component({
    standalone: true,
    selector: 'app-best-selling-widget',
    imports: [CommonModule, ButtonModule, MenuModule],
    template: ` <div class="card">
        <div class="flex justify-between items-center mb-6">
            <div class="font-semibold text-xl">Offres d'emploi les plus pertinentes</div>
            <div>
                <button pButton type="button" icon="pi pi-ellipsis-v" class="p-button-rounded p-button-text p-button-plain" (click)="menu.toggle($event)"></button>
                <p-menu #menu [popup]="true" [model]="items"></p-menu>
            </div>
        </div>
        <ul class="list-none p-0 m-0">
    <li *ngFor="let job of topJobs" class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
            <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">{{ job.title }}</span>
            <div class="mt-1 text-muted-color">{{ job.category }}</div>
        </div>
        <div class="mt-2 md:mt-0 flex items-center">
            <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                <div class="bg-blue-500 h-full" [style.width.%]="job.matchScore"></div>
            </div>
            <span class="text-blue-500 ml-4 font-medium">{{ job.matchScore }}%</span>
        </div>
    </li>
</ul>
    </div>`
})
export class BestSellingWidget {
    menu = null;

    items = [
        { label: 'Add New', icon: 'pi pi-fw pi-plus' },
        { label: 'Remove', icon: 'pi pi-fw pi-trash' }
    ];

    // Example data, replace with your API results
    topJobs = [
        { title: "Java Backend Developer", category: "Engineering", matchScore: 87 },
        { title: "Frontend Angular Dev", category: "Engineering", matchScore: 75 },
        { title: "QA Analyst", category: "Quality", matchScore: 61 },
        { title: "HR Coordinator", category: "Human Resources", matchScore: 53 },
        { title: "UX Designer", category: "Design", matchScore: 80 }
    ];
   /*  menu = null;

    items = [
        { label: 'Add New', icon: 'pi pi-fw pi-plus' },
        { label: 'Remove', icon: 'pi pi-fw pi-trash' }
    ]; */
}
