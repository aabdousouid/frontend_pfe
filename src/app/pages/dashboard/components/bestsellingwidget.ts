import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { JobsService } from '../../../shared/services/jobs.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
    standalone: true,
    selector: 'app-best-selling-widget',
    imports: [CommonModule, ButtonModule, MenuModule,ProgressSpinnerModule],
    template: ` <div class="card">
    <div class="flex justify-between items-center mb-6">
      <div class="font-semibold text-xl">Offres les plus sollicitées</div>
      <div>
        <button pButton type="button" icon="pi pi-ellipsis-v"
                class="p-button-rounded p-button-text p-button-plain"
                (click)="menu.toggle($event)"></button>
        <p-menu #menu [popup]="true" [model]="items"></p-menu>
      </div>
    </div>

    <ng-container *ngIf="loading; else content">
      <div class="flex justify-center py-8">
        <p-progressSpinner [style]="{width:'38px',height:'38px'}" strokeWidth="8" />
      </div>
    </ng-container>

    <ng-template #content>
      <ng-container *ngIf="topAppliedJobs?.length; else empty">
        <ul class="list-none p-0 m-0">
          <li *ngFor="let job of topAppliedJobs" class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">
                {{ job.title }}
              </span>
              <div class="mt-1 text-muted-color">
                {{ job.type }} • {{ job.applications }} candidatures
              </div>
            </div>
            <div class="mt-2 md:mt-0 flex items-center">
              <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                <div class="bg-blue-500 h-full" [style.width.%]="clamp(job.matchingScore)"></div>
              </div>
              <span class="text-blue-500 ml-4 font-medium">{{ clamp(job.matchingScore) }}%</span>
            </div>
          </li>
        </ul>
      </ng-container>
      <ng-template #empty>
        <div class="text-muted-color py-6 text-center">Aucune donnée disponible pour le moment.</div>
      </ng-template>
    </ng-template>

    <div *ngIf="error" class="mt-4 text-red-500 text-sm">
      {{ error }}
    </div>
  </div>`
})
export class BestSellingWidget implements OnInit {
  
    menu = null;
    topAppliedJobs: any[] = [];
    loading = true;
    error = '';
    items = [
    { label: 'Rafraîchir', icon: 'pi pi-fw pi-refresh', command: () => this.load() }
  ];

    // Example data, replace with your API results
    /* topJobs = [
        { title: "Java Backend Developer", category: "Engineering", matchScore: 87 },
        { title: "Frontend Angular Dev", category: "Engineering", matchScore: 75 },
        { title: "QA Analyst", category: "Quality", matchScore: 61 },
        { title: "HR Coordinator", category: "Human Resources", matchScore: 53 },
        { title: "UX Designer", category: "Design", matchScore: 80 }
    ]; */
   /*  menu = null;

    items = [
        { label: 'Add New', icon: 'pi pi-fw pi-plus' },
        { label: 'Remove', icon: 'pi pi-fw pi-trash' }
    ]; */
      constructor(private jobService:JobsService){}



      ngOnInit(): void {
        this.load();
    }
 load() {
    this.loading = true;
    this.error = '';
    this.jobService.getTopAppliedJobs(5).subscribe({
      next: (data) => { this.topAppliedJobs = data || []; this.loading = false; },
      error: () => { this.error = 'Impossible de charger les données.'; this.loading = false; }
    });
  }

  // guard in case backend sends >100 or <0
  clamp(val: number): number { return Math.max(0, Math.min(100, Math.round(val))); }
}
