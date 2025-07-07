import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { PaginatorModule } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { Dialog, DialogModule } from 'primeng/dialog';
import { StepperModule } from 'primeng/stepper';
import { ToggleButton, ToggleButtonModule } from 'primeng/togglebutton';
import { JobsService } from '../../shared/services/jobs.service';
import { MessageModule } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { Job } from '../../shared/models/job';
import { MessageService, ToastMessageOptions } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { StorageService } from '../../shared/services/storage.service';
import { Router } from '@angular/router';
/* export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  experience: string;
  salary: string;
  
  requirements: string[];
  skills: string[];
  postedDate: Date;
  isUrgent?: boolean;
  companyLogo?: string;
  isActive?:boolean;
}  */

export interface FilterOptions {
  locations: { label: string; value: string }[];
  jobTypes: { label: string; value: string }[];
  experienceLevels: { label: string; value: string }[];
  skills: { label: string; value: string }[];
}

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [
    ToggleButtonModule,
    CommonModule,
    FormsModule,
    TextareaModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    MultiSelectModule,
    TagModule,
    BadgeModule,
    ToastModule,
    PaginatorModule,
    SkeletonModule,
    RippleModule,
    TooltipModule,
    ChipModule,
    DividerModule,
    DialogModule,
    StepperModule,
    MessageModule,
    SelectModule,
    ToggleSwitchModule
    /* ToggleButton */

  ],
  template: `
  <p-toast></p-toast>
  <p-dialog [(visible)]="display" [breakpoints]="{ '960px': '75vw' }" [style]="{ width: '30vw' }" [modal]="true">
                   
                    
    <div class="card flex justify-center">
    <p-stepper [(value)]="activeStep" class="basis-[40rem]">
        <p-step-list>
            <p-step [value]="1" class="flex flex-row flex-auto gap-2">
                <ng-template #content let-activateCallback="activateCallback" let-value="value">
                    <button class="bg-transparent border-0 inline-flex flex-col gap-2" (click)="activateCallback()">
                        <span
                            class="rounded-full border-2 w-12 h-12 inline-flex items-center justify-center"
                            [ngClass]="{
                                'bg-primary text-primary-contrast border-primary': value <= activeStep,
                                'border-surface': value > activeStep
                            }"
                        >
                            <i class="pi pi-user"></i>
                        </span>
                    </button>
                </ng-template>
            </p-step>

            <p-step [value]="2" class="flex flex-row flex-auto gap-2">
                <ng-template #content let-activateCallback="activateCallback" let-value="value">
                    <button class="bg-transparent border-0 inline-flex flex-col gap-2" (click)="activateCallback()">
                        <span
                            class="rounded-full border-2 w-12 h-12 inline-flex items-center justify-center"
                            [ngClass]="{
                                'bg-primary text-primary-contrast border-primary': value <= activeStep,
                                'border-surface': value > activeStep
                            }"
                        >
                            <i class="pi pi-star"></i>
                        </span>
                    </button>
                </ng-template>
            </p-step>

            <p-step [value]="3" class="flex flex-row flex-auto gap-2">
                <ng-template #content let-activateCallback="activateCallback" let-value="value">
                    <button class="bg-transparent border-0 inline-flex flex-col gap-2" (click)="activateCallback()">
                        <span
                            class="rounded-full border-2 w-12 h-12 inline-flex items-center justify-center"
                            [ngClass]="{
                                'bg-primary text-primary-contrast border-primary': value <= activeStep,
                                'border-surface': value > activeStep
                            }"
                        >
                            <i class="pi pi-id-card"></i>
                        </span>
                    </button>
                </ng-template>
            </p-step>
        </p-step-list>

        <p-step-panels>
            <p-step-panel [value]="1">
                <ng-template #content let-activateCallback="activateCallback">
                    <div class="flex flex-col gap-2 mx-auto" style="min-height: 16rem; max-width: 20rem">
                        <div class="text-center mt-4 mb-4 text-xl font-semibold">Create Job post</div>
                         <label class="filter-label">Title</label>
                        <div class="field">
                            <input [(ngModel)]="form.title" pInputText id="title" type="text" placeholder="Title" fluid />
                        </div>
                         <label class="filter-label">Company</label>
                        <div class="field">
                            <input [(ngModel)]="form.company" pInputText id="company" type="text" placeholder="company" fluid />
                        </div>
                         <label class="filter-label">Description</label>
                        <div class="field">
                           <textarea pTextarea placeholder="Your Description" id="" [(ngModel)]="form.description" [autoResize]="true" rows="3" cols="30"></textarea>
                        </div>
                    </div>
                    <div class="flex pt-6 justify-end">
                        <p-button (onClick)="activateCallback(2)" label="Next" icon="pi pi-arrow-right" iconPos="right" />
                    </div>
                </ng-template>
            </p-step-panel>

            <p-step-panel [value]="2">
                <ng-template #content let-activateCallback="activateCallback">
                    <div class="flex flex-col gap-2 mx-auto" style="min-height: 16rem; max-width: 24rem">
                        <div class="text-center mt-4 mb-4 text-xl font-semibold">Choose job skills</div>
                        <div class="flex flex-wrap justify-center gap-4">
                          <p-togglebutton [(ngModel)]="option1" onLabel="Java" offLabel="Java" (onChange)="updateRequirements()" />
                          <p-togglebutton [(ngModel)]="option2" onLabel="Angular" offLabel="Angular" (onChange)="updateRequirements()" />
                          <p-togglebutton [(ngModel)]="option3" onLabel="Springboot" offLabel="Springboot" (onChange)="updateRequirements()" />
                          <p-togglebutton [(ngModel)]="option4" onLabel="Devops" offLabel="Devops" (onChange)="updateRequirements()" />
                          <p-togglebutton [(ngModel)]="option5" onLabel="Python" offLabel="Python" (onChange)="updateRequirements()" />
                          <p-togglebutton [(ngModel)]="option6" onLabel="Machine Learning" offLabel="Machine Learning" (onChange)="updateRequirements()" />
                          <p-togglebutton [(ngModel)]="option7" onLabel="SQL" offLabel="SQL" (onChange)="updateRequirements()" />
                          <p-togglebutton [(ngModel)]="option8" onLabel="Javascript" offLabel="Javascript" (onChange)="updateRequirements()" />
                          <p-togglebutton [(ngModel)]="option9" onLabel="Node JS" offLabel="Node JS" (onChange)="updateRequirements()" />
                          <p-togglebutton [(ngModel)]="option10" onLabel="Docker" offLabel="Docker" (onChange)="updateRequirements()" />
                        </div>
                    </div>
                    <div class="flex pt-6 justify-between">
                        <p-button (onClick)="activateCallback(1)" label="Back" severity="secondary" icon="pi pi-arrow-left" />
                        <p-button (onClick)="activateCallback(3)" label="Next" icon="pi pi-arrow-right" iconPos="right" />
                    </div>
                </ng-template>
            </p-step-panel>

            <p-step-panel [value]="3">
                <ng-template #content let-activateCallback="activateCallback">
                    <div class="flex flex-col gap-2 mx-auto" style="min-height: 16rem; max-width: 24rem">
                        <div class="text-center mt-4 mb-4 text-xl font-semibold">Additional information</div>
                        <label class="filter-label">Location</label>
                        <div class="field">
                            
                            <p-select class="filter-dropdown" [(ngModel)]="form.location" [options]="dropdownValues" optionLabel="name" placeholder="Location" />
                        </div>
                        <label class="filter-label">Job Type</label>
                         <div class="field">
                            
                            <p-select class="filter-dropdown" [(ngModel)]="form.jobType" [options]="dropdownValuesJob" optionLabel="name" placeholder="Type" />
                        </div>
                        <label class="filter-label">Salary Range</label>
                         <div class="field">
                            
                            <p-select class="filter-dropdown" [(ngModel)]="form.salaryRange" [options]="dropdownValuesSalary" optionLabel="name" placeholder="salary Range" />
                        </div>

                        <label class="filter-label">Requirements</label>
                         <div class="field">
                            
                            <textarea pTextarea placeholder="Your Description" id="" [(ngModel)]="form.requirements" [autoResize]="true" rows="3" cols="30"></textarea>
                        </div>


                        <label class="filter-label">Experience</label>
                         <div class="field">
                            
                           <input [(ngModel)]="form.experience" pInputText id="company" type="text" placeholder="company" fluid />
                        </div>
                        <label class="filter-label">Urgency</label>
                        <div class="field">
                          <p-toggleswitch [(ngModel)]="form.isUrgent" />
                        </div>
                    </div>
                    <div class="flex pt-6 justify-between">
                        <p-button (onClick)="activateCallback(2)" label="Back" severity="secondary" icon="pi pi-arrow-left" />
                        <p-button icon="pi pi-plus" iconPos="left" (onClick)="onsubmit()" />
                    </div>
                </ng-template>
            </p-step-panel>
        </p-step-panels>
    </p-stepper>
</div>
                    
                    <ng-template #footer>
                       <!--  <p-button label="Add Job" (click)="close()" /> -->
                    </ng-template>
        </p-dialog>
    <div class="job-list-container">
      <!-- Header Section -->
      <div class="header-section">
        <div class="title-section">
          <h1 class="main-title">Nos offres d'emploi et de stages</h1>
          <p class="subtitle">Découvrez les opportunités qui correspondent à vos compétences et à vos aspirations</p>
          
        </div>
        
        <!-- Search and Filters -->
        <div class="search-filter-section">
          @if(isAdmin==true) {
          <div style="padding: 2rem;">
          <p-button icon="pi pi-plus" severity="success" text raised rounded (onClick)="open()"/>
          </div>}
          <div class="search-bar">
            <span class="p-input-icon-left search-input-wrapper">
              <i class="pi pi-search"></i>
              <input 
                type="text" 
                pInputText 
                placeholder="Recherchez des emplois, des entreprises ou des keywords..." 
                [(ngModel)]="searchQuery"
                (input)="onSearchChange()"
                class="search-input"
              />
            </span>
          </div>
          
          <div class="filters-row">
            <div class="filter-group">
              <label class="filter-label">Localisation</label>
              <p-dropdown 
                [options]="filterOptions.locations"
                [(ngModel)]="selectedLocation"
                placeholder="All Locations"
                [showClear]="true"
                (onChange)="applyFilters()"
                class="filter-dropdown"
              ></p-dropdown>
            </div>
            
            <div class="filter-group">
              <label class="filter-label">Catégorie des offres</label>
              <p-dropdown 
                [options]="filterOptions.jobTypes"
                [(ngModel)]="selectedJobType"
                placeholder="All Types"
                [showClear]="true"
                (onChange)="applyFilters()"
                class="filter-dropdown"
              ></p-dropdown>
            </div>
            
            <div class="filter-group">
              <label class="filter-label">Experience</label>
              <p-dropdown 
                [options]="filterOptions.experienceLevels"
                [(ngModel)]="selectedExperience"
                placeholder="All Levels"
                [showClear]="true"
                (onChange)="applyFilters()"
                class="filter-dropdown"
              ></p-dropdown>
            </div>
            
            <div class="filter-group">
              <label class="filter-label">Skills</label>
              <p-multiSelect 
                [options]="filterOptions.skills"
                [(ngModel)]="selectedSkills"
                placeholder="Select Skills"
                [showClear]="true"
                (onChange)="applyFilters()"
                class="filter-multiselect"
                [maxSelectedLabels]="2"
              ></p-multiSelect>
            </div>
            
            <div class="filter-actions">
              <p-button 
                label="Clear All" 
                icon="pi pi-times" 
                [outlined]="true" 
                (onClick)="clearFilters()"
                class="clear-btn"
              ></p-button>
            </div>
          </div>
        </div>
      </div>

      <!-- Results Summary -->
      <div class="results-summary">
        <div class="results-info">
          <span class="results-count">{{ filteredJobs.length }} jobs found</span>
          <span class="results-text">• Updated {{ lastUpdated | date:'short' }}</span>
        </div>
        
        <div class="sort-section">
          <label class="sort-label">Sort by:</label>
          <p-dropdown 
            [options]="sortOptions"
            [(ngModel)]="selectedSort"
            (onChange)="applySorting()"
            class="sort-dropdown"
          ></p-dropdown>
        </div>
      </div>

      <!-- Job Cards Grid -->
      <div class="jobs-grid" *ngIf="!loading; else loadingTemplate">
        <div class="job-card-wrapper" *ngFor="let job of paginatedJobs; trackBy: trackByJobId">
          <p-card class="job-card" [class.urgent-job]="job.isUrgent">
            <div class="job-card-header">
              <div class="company-info">
                <div class="company-logo" *ngIf="job.companyLogo">
                  <img [src]="job.companyLogo" [alt]="job.company + ' logo'" />
                </div>
                <div class="company-logo-placeholder" *ngIf="!job.companyLogo">
                  {{ job.company.charAt(0).toUpperCase() }}
                </div>
                <div class="job-title-info">
                  <h3 class="job-title">{{ job.title }}</h3>
                  <p class="company-name">{{ job.company }}</p>
                </div>
              </div>
              
              <div class="job-badges">
                <p-badge 
                  *ngIf="job.isUrgent" 
                  value="Urgent" 
                  severity="danger"
                  class="urgent-badge"
                ></p-badge>
                <p-tag 
                  [value]="job.jobType" 
                  [severity]="getJobTypeSeverity(job.jobType)"
                  class="job-type-tag"
                ></p-tag>
              </div>
            </div>

            <div class="job-details">
              <div class="job-meta">
                <span class="meta-item">
                  <i class="pi pi-map-marker"></i>
                  {{ job.location }}
                </span>
                <span class="meta-item">
                  <i class="pi pi-briefcase"></i>
                  {{ job.experience }}
                </span>
                <span class="meta-item">
                  <i class="pi pi-dollar"></i>
                  {{ job.salary }}
                </span>
                <span class="meta-item">
                  <i class="pi pi-calendar"></i>
                  {{ getTimeAgo(job.postedDate) }}
                </span>
              </div>

              <p class="job-description">{{ job.description }}</p>

              <div class="job-skills">
                <p-chip 
                  *ngFor="let skill of job.skills.slice(0, 4)" 
                  [label]="skill"
                  class="skill-chip"
                ></p-chip>
                <span *ngIf="job.skills.length > 4" class="more-skills">
                  +{{ job.skills.length - 4 }} more
                </span>
              </div>
            </div>

            <p-divider></p-divider>

            <div class="job-actions">
              <p-button 
                label="View Details" 
                icon="pi pi-eye" 
                [outlined]="true"
                (onClick)="viewJobDetails(job)"
                class="view-btn"
              ></p-button>
              <p-button 
                label="Apply Now" 
                icon="pi pi-send"
                (click)="applyToJob(job.jobId)"
                class="apply-btn"
              ></p-button>
            </div>
          </p-card>
        </div>
      </div>

      <!-- Loading Template -->
      <ng-template #loadingTemplate>
        <div class="jobs-skeleton">
          <div class="skeleton-card" *ngFor="let item of [1,2,3,4,5,6]">
            <p-skeleton height="200px"></p-skeleton>
          </div>
        </div>
      </ng-template>

      <!-- No Results -->
      <div class="no-results" *ngIf="filteredJobs.length === 0 && !loading">
        <i class="pi pi-search no-results-icon"></i>
        <h3>No jobs found</h3>
        <p>Try adjusting your search criteria or filters</p>
        <p-button 
          label="Clear Filters" 
          icon="pi pi-refresh" 
          (onClick)="clearFilters()"
          class="clear-all-btn"
        ></p-button>
      </div>

      <!-- Pagination -->
      <div class="pagination-wrapper" *ngIf="filteredJobs.length > 0">
        <p-paginator
          [rows]="itemsPerPage"
          [totalRecords]="filteredJobs.length"
          [first]="first"
          (onPageChange)="onPageChange($event)"
          [showCurrentPageReport]="true"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} jobs"
        ></p-paginator>
      </div>
    </div>
  `,
  styles: [`.job-list-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      background: linear-gradient(135deg, #f8fffe 0%, #f0f9f7 100%);
      min-height: 100vh;
    }

    /* Header Styles */
    .header-section {
      margin-bottom: 2rem;
    }

    .title-section {
      text-align: center;
      margin-bottom: 2rem;
    }

    .main-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #2c3e50;
      margin: 0 0 0.5rem 0;
      background: linear-gradient(135deg, #2c3e50 0%, #27ae60 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      font-size: 1.2rem;
      color: #7f8c8d;
      margin: 0;
    }

    /* Search and Filter Styles */
    .search-filter-section {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(39, 174, 96, 0.1);
      border: 1px solid rgba(39, 174, 96, 0.1);
    }

    .search-bar {
      margin-bottom: 1.5rem;
    }

    .search-input-wrapper {
      width: 100%;
      position: relative;
    }

    .search-input-wrapper .pi-search {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #27ae60;
      z-index: 2;
    }

    .search-input {
      width: 100%;
      padding: 12px 16px 12px 40px;
      border: 2px solid #e8f5e8;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .search-input:focus {
      border-color: #27ae60;
      box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.1);
    }

    .filters-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      align-items: end;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .filter-label {
      font-weight: 600;
      color: #2c3e50;
      font-size: 0.9rem;
    }

    .filter-dropdown,
    .filter-multiselect {
      width: 100%;
    }

    .clear-btn {
      background: transparent;
      //border: 2px solid #e74c3c;
      color: #e74c3c;
    }

    /* .clear-btn:hover {
      background: #e74c3c;
      color: white;
    } */

    /* Results Summary */
    .results-summary {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 2rem 0 1.5rem 0;
      padding: 1rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }

    .results-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .results-count {
      font-weight: 700;
      color: #27ae60;
      font-size: 1.1rem;
    }

    .results-text {
      color: #7f8c8d;
    }

    .sort-section {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .sort-label {
      font-weight: 600;
      color: #2c3e50;
    }

    /* Job Cards Grid */
    .jobs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .job-card-wrapper {
      transition: transform 0.3s ease;
    }

    .job-card-wrapper:hover {
      transform: translateY(-4px);
    }

    .job-card {
      height: 100%;
      border: 1px solid rgba(39, 174, 96, 0.1);
      border-radius: 12px;
      transition: all 0.3s ease;
      background: white;
    }

    .job-card:hover {
      box-shadow: 0 8px 30px rgba(39, 174, 96, 0.15);
     // border-color: #27ae60;
    }

    .urgent-job {
      //border-left: 4px solid #e74c3c !important;
    }

    .job-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .company-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex: 1;
    }

    .company-logo {
      width: 50px;
      height: 50px;
      border-radius: 8px;
      overflow: hidden;
      flex-shrink: 0;
    }

    .company-logo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .company-logo-placeholder {
      width: 50px;
      height: 50px;
      border-radius: 8px;
      background: linear-gradient(135deg, #27ae60, #2ecc71);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .job-title {
      margin: 0 0 0.25rem 0;
      color: #2c3e50;
      font-size: 1.3rem;
      font-weight: 700;
      line-height: 1.3;
    }

    .company-name {
      margin: 0;
      color: #7f8c8d;
      font-weight: 500;
    }

    .job-badges {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      align-items: flex-end;
    }

    .urgent-badge {
      background: #e74c3c;
    }

    .job-type-tag {
      background: #e8f5e8;
      color: #27ae60;
    }

    /* Job Details */
    .job-details {
      margin-bottom: 1rem;
    }

    .job-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #7f8c8d;
      font-size: 0.9rem;
    }

    .meta-item i {
      color: #27ae60;
    }

    .job-description {
      color: #5a6c7d;
      line-height: 1.6;
      margin-bottom: 1rem;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .job-skills {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      align-items: center;
    }

    .skill-chip {
      background: #e8f5e8;
      color: #27ae60;
      border: 1px solid rgba(39, 174, 96, 0.2);
    }

    .more-skills {
      color: #7f8c8d;
      font-size: 0.9rem;
      font-weight: 500;
    }

    /* Job Actions */
    .job-actions {
      display: flex;
      gap: 0.75rem;
    }

    .view-btn {
      flex: 1;
      //border: 2px solid #27ae60;
      color: #27ae60;
      background: transparent;
    }

    /* .view-btn:hover {
      background: #27ae60;
      color: white;
    } */

    .apply-btn {
      flex: 2;
     // background: linear-gradient(135deg, #27ae60, #2ecc71);
      border: none;
      color: white;
      font-weight: 600;
    }

    .apply-btn:hover {
      //background: linear-gradient(135deg, #229954, #27ae60);
      transform: translateY(-1px);
    }

    /* Loading Skeleton */
    .jobs-skeleton {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 1.5rem;
    }

    .skeleton-card {
      border-radius: 12px;
      overflow: hidden;
    }

    /* No Results */
    .no-results {
      text-align: center;
      padding: 3rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    }

    .no-results-icon {
      font-size: 4rem;
      color: #bdc3c7;
      margin-bottom: 1rem;
    }

    .no-results h3 {
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }

    .no-results p {
      color: #7f8c8d;
      margin-bottom: 1.5rem;
    }

    .clear-all-btn {
      background: #27ae60;
      border: none;
      color: white;
    }

    /* Pagination */
    .pagination-wrapper {
      margin-top: 2rem;
      display: flex;
      justify-content: center;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .job-list-container {
        padding: 1rem;
      }

      .main-title {
        font-size: 2rem;
      }

      .jobs-grid {
        grid-template-columns: 1fr;
      }

      .filters-row {
        grid-template-columns: 1fr;
      }

      .results-summary {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }

      .job-actions {
        flex-direction: column;
      }

      .job-meta {
        flex-direction: column;
        gap: 0.5rem;
      }
    }

    /* Custom PrimeNG Overrides */
    ::ng-deep .p-card .p-card-body {
      padding: 1.5rem;
    }

    ::ng-deep .p-dropdown,
    ::ng-deep .p-multiselect {
      border: 2px solid #e8f5e8;
      border-radius: 8px;
    }

    ::ng-deep .p-dropdown:not(.p-disabled):hover,
    ::ng-deep .p-multiselect:not(.p-disabled):hover {
      border-color: #27ae60;
    }

    ::ng-deep .p-dropdown.p-focus,
    ::ng-deep .p-multiselect.p-focus {
      box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.1);
      border-color: #27ae60;
    }

    ::ng-deep .p-paginator {
      background: white;
      border: 1px solid rgba(39, 174, 96, 0.1);
      border-radius: 8px;
    }

    ::ng-deep .p-paginator .p-paginator-pages .p-paginator-page.p-highlight {
      background: #27ae60;
      border-color: #27ae60;
    }`],
  providers: [MessageService]
})
export class JobListComponent implements OnInit {

  
  job!: Job ;



  form: any={
    title: '',
    company: '',
    description: '',
    location: '',
    jobType:'' ,
    experience:'',
    salary: '',
    requirements: '',
    skills:[],
    postedDate: new Date(),
    isActive:true,
    isUrgent: false,
  }
  constructor(private jobService:JobsService,private service:MessageService, private storageService:StorageService,private router:Router) { 
    
  }
showSuccessViaToast() {
        console.log('Success message displayed');
        this.service.add({ severity: 'success', summary: 'Success Message', detail: 'Message sent' });
    }
toggleSkills = [
  { label: 'Java', model: 'option1' },
  { label: 'Angular', model: 'option2' },
  { label: 'Springboot', model: 'option3' },
  { label: 'Devops', model: 'option4' },
  { label: 'Python', model: 'option5' },
  { label: 'Machine Learning', model: 'option6' },
  { label: 'SQL', model: 'option7' },
  { label: 'Javascript', model: 'option8' },
  { label: 'Node JS', model: 'option9' },
  { label: 'Docker', model: 'option10' }
];



  activeStep: number = 1;

    name: string | undefined = '';

    email: string | undefined = '';

    password: string | undefined = '';

    option1: boolean | undefined = false;

    option2: boolean | undefined = false;

    option3: boolean | undefined = false;

    option4: boolean | undefined = false;

    option5: boolean | undefined = false;

    option6: boolean | undefined = false;

    option7: boolean | undefined = false;

    option8: boolean | undefined = false;

    option9: boolean | undefined = false;

    option10: boolean | undefined = false;




  // Data Properties
  display: boolean = false;
  jobs: Job[] = [];
  jobs2: Job[] = [];
  filteredJobs: Job[] = [];
  paginatedJobs: Job[] = [];
  dropdownValues = [
        { name: 'ACTIA ES' },
        { name: 'CIPI ACTIA' },
        { name: 'ACTIA AFRICA' },
        { name: 'ACTIA Paris' }
    ];


dropdownValuesJob = [
  {name:"Full-time",value:'FULL_TIME'  },
  {name:"Part-time",value:'PART_TIME'  },
  {name:"Internship",value:'INTERNSHIP'  },
  {name:"Remote",value:'REMOTE'  },
  {name:"Contract",value:'CONTRACT'  },];

    dropdownValuesSalary = [
        { name: '1700Dt - 2000Dt' },
        { name: '2000Dt - 2300Dt' },
        { name: '2500Dt - 3000Dt' },
        { name: '3500Dt - 4000Dt' }
    ];

  // Filter Properties
  searchQuery: string = '';
  selectedLocation: string = '';
  selectedJobType: string = '';
  selectedExperience: string = '';
  selectedSkills: string[] = [];
  selectedSort: string = 'recent';
  
  // Pagination Properties
  first: number = 0;
  itemsPerPage: number = 6;
  
  // UI Properties
  loading: boolean = true;
  lastUpdated: Date = new Date();
  
  // Filter Options
  filterOptions: FilterOptions = {
    locations: [
      { label: 'New York, NY', value: 'new-york' },
      { label: 'San Francisco, CA', value: 'san-francisco' },
      { label: 'London, UK', value: 'london' },
      { label: 'Toronto, Canada', value: 'toronto' },
      { label: 'Remote', value: 'remote' },
      { label: 'Berlin, Germany', value: 'berlin' }
    ],
    jobTypes: [
      { label: 'Full-time', value: 'Full-time' },
      { label: 'Part-time', value: 'Part-time' },
      { label: 'Contract', value: 'Contract' },
      { label: 'Remote', value: 'Remote' }
    ],
    experienceLevels: [
      { label: 'Entry Level', value: 'entry' },
      { label: 'Mid Level', value: 'mid' },
      { label: 'Senior Level', value: 'senior' },
      { label: 'Lead/Principal', value: 'lead' }
    ],
    skills: [
      { label: 'JavaScript', value: 'javascript' },
      { label: 'TypeScript', value: 'typescript' },
      { label: 'Angular', value: 'angular' },
      { label: 'React', value: 'react' },
      { label: 'Node.js', value: 'nodejs' },
      { label: 'Python', value: 'python' },
      { label: 'Java', value: 'java' },
      { label: 'AWS', value: 'aws' },
      { label: 'Docker', value: 'docker' },
      { label: 'Kubernetes', value: 'kubernetes' }
    ]
  };
  
  sortOptions = [
    { label: 'Most Recent', value: 'recent' },
    { label: 'Salary: High to Low', value: 'salary-desc' },
    { label: 'Salary: Low to High', value: 'salary-asc' },
    { label: 'Company A-Z', value: 'company-asc' },
    { label: 'Title A-Z', value: 'title-asc' }
  ];
  role:string [] = [];
  isAdmin: boolean = false;
  ngOnInit() {
      
        this.role = this.storageService.getUser().roles;
       
        if(this.role.includes('ROLE_ADMIN')){
        this.isAdmin = true;
        }
    this.loadJobs();
  }
updateRequirements() {
  this.form.skills = this.toggleSkills
    .filter(skill => (this as any)[skill.model])
    .map(skill => skill.label);
}

  loadJobs() {
    // Simulate API call
    /* this.jobService.getAllJobs().subscribe({
      next: (data) => {
        for (const job of data) {
          if (this.jobs.includes(job)) {
            console.log('Job already exists:', job);
          }
          else{
            this.jobs.push(job);
            console.log('Job added:', job);
          }}
      },
      error: (error) => {
        console.error('Error fetching jobs:', error);
        this.loading = false;
      }
    }) */
   /*  setTimeout(() => {
     // this.jobs = this.getMockJobs();
     this.jobs = this.getJobs(); 
     console.log(this.jobs);
      this.filteredJobs = [...this.jobs];
      this.updatePaginatedJobs();
      this.loading = false;
    }, 1500); */

this.loading = true;
  this.jobService.getAllJobs().subscribe({
    next: (data) => {
      // Convert string dates to Date objects and ensure proper data structure
      this.jobs = data.map((job:any) => ({
        ...job,
        postedDate: new Date(job.postedDate), // Convert string to Date
        skills: Array.isArray(job.skills) ? job.skills : [], // Ensure skills is an array
        requirements: Array.isArray(job.requirements) ? job.requirements : [] // Ensure requirements is an array
      }));
      
      this.filteredJobs = [...this.jobs];
      this.updatePaginatedJobs();
      this.loading = false;
      console.log('Jobs loaded successfully:', this.jobs);
    },
    error: (error) => {
      console.error('Error fetching jobs:', error);
      this.loading = false;
      // Fallback to mock data if API fails
      this.jobs = this.getMockJobs();
      this.filteredJobs = [...this.jobs];
      this.updatePaginatedJobs();
    }
  });
  }


  getJobs():Job[]{
    this.jobService.getAllJobs().subscribe({
      next: (data) => {
        for (const job of data) {
          if (this.jobs2.includes(job)===false) {
            this.jobs2.push(job);
            
          }
          else{
            
            console.log('Job already exists:', job);
          }}
      },
      error: (error) => {
        console.error('Error fetching jobs:', error);
        this.loading = false;
      }
  })
  return this.jobs2
}
  getMockJobs(): Job[] {
    return [
      {
        jobId: 1,
        title: 'Senior Frontend Developer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        jobType: 'Full-time',
        experience: '5+ years',
        salary: '$120k - $150k',
        description: 'We are looking for a passionate Senior Frontend Developer to join our dynamic team. You will be responsible for building scalable web applications using modern frameworks.',
        requirements: ['5+ years React experience', 'TypeScript proficiency', 'Team leadership'],
        skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'Node.js'],
        postedDate: new Date(2024, 5, 1),
        isUrgent: true
      },
      {
        jobId: 2,
        title: 'Full Stack Engineer',
        company: 'StartupXYZ',
        location: 'Remote',
        jobType: 'Remote',
        experience: '3-5 years',
        salary: '$90k - $120k',
        description: 'Join our fast-growing startup as a Full Stack Engineer. Work on cutting-edge projects and help shape the future of our platform.',
        requirements: ['Full stack development', 'API design', 'Database optimization'],
        skills: ['Angular', 'Node.js', 'Python', 'PostgreSQL', 'AWS'],
        postedDate: new Date(2024, 5, 5)
      },
      {
        jobId: 3,
        title: 'DevOps Engineer',
        company: 'CloudTech Solutions',
        location: 'New York, NY',
        jobType: 'Full-time',
        experience: '4-6 years',
        salary: '$130k - $160k',
        description: 'We need a skilled DevOps Engineer to manage our cloud infrastructure and improve our deployment processes.',
        requirements: ['AWS/Azure experience', 'Docker/Kubernetes', 'CI/CD pipelines'],
        skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Python'],
        postedDate: new Date(2024, 4, 28),
        isUrgent: true
      },
      {
        jobId: 4,
        title: 'UX/UI Designer',
        company: 'Design Studio Pro',
        location: 'London, UK',
        jobType: 'Contract',
        experience: '2-4 years',
        salary: '£45k - £60k',
        description: 'Creative UX/UI Designer wanted to work on innovative digital products. Must have a strong portfolio and user-centered design approach.',
        requirements: ['Strong portfolio', 'Figma/Sketch expertise', 'User research'],
        skills: ['Figma', 'Sketch', 'Adobe Creative Suite', 'Prototyping', 'User Research'],
        postedDate: new Date(2024, 5, 3)
      },
      {
        jobId: 5,
        title: 'Backend Developer',
        company: 'Enterprise Corp',
        location: 'Toronto, Canada',
        jobType: 'Full-time',
        experience: '3-5 years',
        salary: 'CAD $85k - $110k',
        description: 'Backend Developer position available for building robust server-side applications. Experience with microservices architecture preferred.',
        requirements: ['Java/Spring Boot', 'Microservices', 'Database design'],
        skills: ['Java', 'Spring Boot', 'MySQL', 'Redis', 'Kafka'],
        postedDate: new Date(2024, 5, 7)
      },
      {
        jobId: 6,
        title: 'Data Scientist',
        company: 'AI Innovations',
        location: 'Berlin, Germany',
        jobType: 'Full-time',
        experience: '2-4 years',
        salary: '€70k - €90k',
        description: 'Join our AI team as a Data Scientist. Work on machine learning models and help drive data-driven decision making.',
        requirements: ['Python/R', 'Machine Learning', 'Statistics'],
        skills: ['Python', 'TensorFlow', 'Pandas', 'SQL', 'Jupyter'],
        postedDate: new Date(2024, 5, 6)
      }
    ];
  }

  onSearchChange() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredJobs = this.jobs.filter(job => {
      const matchesSearch = !this.searchQuery || 
        job.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(this.searchQuery.toLowerCase()));

      const matchesLocation = !this.selectedLocation || 
        job.location.toLowerCase().includes(this.selectedLocation.toLowerCase());

      const matchesJobType = !this.selectedJobType || 
        job.jobType === this.selectedJobType;

      const matchesExperience = !this.selectedExperience || 
        this.matchesExperienceLevel(job.experience, this.selectedExperience);

      const matchesSkills = this.selectedSkills.length === 0 || 
        this.selectedSkills.some(skill => 
          job.skills.some(jobSkill => 
            jobSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );

      return matchesSearch && matchesLocation && matchesJobType && matchesExperience && matchesSkills;
    });

    this.applySorting();
    this.first = 0;
    this.updatePaginatedJobs();
  }

  matchesExperienceLevel(jobExperience: string, selectedLevel: string): boolean {
    const experience = jobExperience.toLowerCase();
    switch (selectedLevel) {
      case 'entry':
        return experience.includes('entry') || experience.includes('0-2') || experience.includes('junior');
      case 'mid':
        return experience.includes('mid') || experience.includes('2-5') || experience.includes('3-5');
      case 'senior':
        return experience.includes('senior') || experience.includes('5+') || experience.includes('4-6');
      case 'lead':
        return experience.includes('lead') || experience.includes('principal') || experience.includes('7+');
      default:
        return true;
    }
  }

  applySorting() {
  switch (this.selectedSort) {
    case 'recent':
      this.filteredJobs.sort((a, b) => {
        const dateA = a.postedDate instanceof Date ? a.postedDate.getTime() : new Date(a.postedDate).getTime();
        const dateB = b.postedDate instanceof Date ? b.postedDate.getTime() : new Date(b.postedDate).getTime();
        return dateB - dateA;
      });
      break;
    case 'salary-desc':
      this.filteredJobs.sort((a, b) => this.extractSalaryNumber(b.salary) - this.extractSalaryNumber(a.salary));
      break;
    case 'salary-asc':
      this.filteredJobs.sort((a, b) => this.extractSalaryNumber(a.salary) - this.extractSalaryNumber(b.salary));
      break;
    case 'company-asc':
      this.filteredJobs.sort((a, b) => a.company.localeCompare(b.company));
      break;
    case 'title-asc':
      this.filteredJobs.sort((a, b) => a.title.localeCompare(b.title));
      break;
  }
}

  extractSalaryNumber(salary: string): number {
    const numbers = salary.match(/\d+/g);
    return numbers ? parseInt(numbers[0]) : 0;
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedLocation = '';
    this.selectedJobType = '';
    this.selectedExperience = '';
    this.selectedSkills = [];
    this.selectedSort = 'recent';
    this.applyFilters();
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.itemsPerPage = event.rows;
    this.updatePaginatedJobs();
  }

  updatePaginatedJobs() {
    const start = this.first;
    const end = start + this.itemsPerPage;
    this.paginatedJobs = this.filteredJobs.slice(start, end);
  }

  trackByJobId(index: number, job: Job): number {
    return job.jobId;
  }

  getJobTypeSeverity(type: string): string {
    switch (type) {
      case 'Full-time':
        return 'success';
      case 'Part-time':
        return 'info';
      case 'Contract':
        return 'warning';
      case 'Remote':
        return 'secondary';
      default:
        return 'info';
    }
  }

  getTimeAgo(date: Date | string): string {
  const now = new Date();
  const jobDate = date instanceof Date ? date : new Date(date);
  const diffTime = Math.abs(now.getTime() - jobDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    return '1 day ago';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  } else {
    const months = Math.floor(diffDays / 30);
    return months === 1 ? '1 month ago' : `${months} months ago`;
  }
}

  viewJobDetails(job: Job) {
    console.log('Viewing job details for:', job.title);
    // Implement navigation to job details page
    // this.router.navigate(['/jobs', job.id]);
  }

  applyToJob(jobId: any) {
    //console.log('Applying to job:', job.title);

    // Implement job application logic
    this.router.navigate(['/app/jobapplication', jobId]);
  }



 onsubmit() {
  this.updateRequirements();
  this.job = this.form;
  this.job.jobType = this.form.jobType.value;
  this.job.location = this.form.location.name;
  this.job.salary = this.form.salaryRange.name; // Ensure requirements are up to date
  console.log(this.job);
  this.jobService.addJob(this.job).subscribe({
    next: (response) => {
      this.service.add({ severity: 'success', summary: 'Job Added', detail: 'Your job has been successfully added!' });
      this.close(); // Close the dialog after successful submission
      this.form.clear();
      this.loadJobs(); // Reload jobs to reflect the new addition
      console.log('Job added successfully:', response);
    },
    error: (error) => {
      this.service.add({ severity: 'error', summary: 'Error', detail: 'There was an error adding the job. Please try again.' });
      console.error('Error adding job:', error);
    }
  }) 
} 


  open() {
        this.display = true;
    }
    close() {
        this.display = false;
    }

/* onSubmit(): void {
    const { username, password } = this.form;

    this.jobService.addJob(username, password).subscribe({
      next: data => {
        this.storageService.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.storageService.getUser().roles;
        //this.reloadPage();
        
        // test
        this.navigateAfterLogin();
        this.messageService.add({ severity: 'success', summary: 'Login success', detail: `Welcome ${username}` });
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.messageService.add({ severity: 'error', summary: 'Login failed!', detail: 'Check your credentials!' });
        this.isLoginFailed = true;
      }
    });
  } */

}