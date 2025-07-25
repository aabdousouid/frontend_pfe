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
import { DialogModule } from 'primeng/dialog';
import { StepperModule } from 'primeng/stepper';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { MessageModule } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ActivatedRoute, Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { StorageService } from '../../../shared/services/storage.service';
import { ApplicationService } from '../../../shared/services/application.service';
import { Application } from '../../../shared/models/application';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TimelineModule } from 'primeng/timeline';
import { PanelModule } from 'primeng/panel';


@Component({
  selector: 'app-application-list',
  standalone: true,
  imports: [
    TableModule,
    ToggleButtonModule,
    TimelineModule,
    CommonModule,
    PanelModule,
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
    ProgressBarModule,
    StepperModule,
    MessageModule,
    SelectModule,
    ToggleSwitchModule,
    ProgressSpinnerModule,
    BreadcrumbModule
  ],
  template: `
    <div class="application-details-container">
  <!-- Loading State -->
  <div *ngIf="loading" class="loading-container">
    <p-progressSpinner></p-progressSpinner>
  </div>

  <!-- Application Details -->
  <div *ngIf="!loading" class="application-content">
    
    <!-- Breadcrumb -->
    <p-breadcrumb 
          [model]="[
            {label: 'Dashboard', routerLink: '/app/dashboard', icon: 'pi pi-home'},
            {label: 'Les Candidatures', routerLink: '/app/applications', icon: 'pi pi-users'},
            {label: 'Détails de la candidature', icon: 'pi pi-file-o'}
          ]"
          class="mb-4">
        </p-breadcrumb>

    <!-- Main Content Grid -->
    <div class="grid">
      
      <!-- Left Column - Basic Information -->
      <div class="col-12 md:col-4">
        <p-card header="Informations de base" styleClass="mb-4">
          <div class="application-info">
            <div class="info-item">
              <label>Nom du candidat :</label>
              <span class="font-semibold">{{ application.user?.firstname || 'N/A' }} {{ application.user?.lastname || '' }}</span>
            </div>
            
            <div class="info-item">
              <label>Email :</label>
              <span>{{ application.user?.email || 'N/A' }}</span>
            </div>
            
            <div class="info-item">
              <label>Position :</label>
              <span class="font-semibold">{{ application.job?.title || 'N/A' }}</span>
            </div>
            
            <div class="info-item">
              <label>Date de candidature :</label>
              <span>{{ application.appliedDate | date:'medium' }}</span>
            </div>
            
            <div class="info-item">
              <label>Statut:</label>
              <p-tag 
                [value]="application.status" 
                [severity]="getStatusSeverity(application.status)"
                class="status-tag">
              </p-tag>
            </div>
            
            <div class="info-item" *ngIf="application.lastUpdated">
              <label>Dernière mise à jour :</label>
              <span>{{ application.lastUpdated | date:'medium' }}</span>
            </div>
          </div>
        </p-card>

        <!-- Actions Card -->
        <p-card header="Actions" styleClass="mb-4">
          <div class="action-buttons">
            <p-button 
              label="Télécharger le CV" 
              icon="pi pi-download" 
              styleClass="p-button-success mb-3 w-full"
              (click)="downloadCV()"
              [disabled]="!application.cvFileName">
            </p-button>
            
            <p-button 
              label="Planifier l'entretien" 
              icon="pi pi-calendar" 
              styleClass="p-button-info mb-3 w-full"
              (click)="scheduleInterview()">
            </p-button>
            
            <p-button 
              label="Supprimer la candidature" 
              icon="pi pi-trash" 
              styleClass="p-button-danger w-full"
              (click)="deleteApplication()">
            </p-button>
          </div>
        </p-card>
      </div>

      <!-- Right Column - Detailed Analysis -->
      <div class="col-12 md:col-8">
        
        <!-- Application Analysis -->
        <p-card styleClass="mb-4">
          <ng-template pTemplate="header">
            <div class="flex justify-content-between align-items-center w-full">
              <span class="text-xl font-semibold">CV Analysé</span>
              <p-chip 
                label="Analyse automatique" 
                icon="pi pi-cog" 
                [style]="{'margin-left': '1.5rem'}"
                severity="warn"
                styleClass="p-button-outlined p-button-primary"
                size="small">
              </p-chip>
            </div>
          </ng-template>
          
          <!-- Resume Section -->
          <div class="resume-section mb-4">
            <h3 class="section-title">Resumé</h3>
            <p class="resume-content">
               {{ application.cvSummary|| "Professional resume content will be displayed here. This section provides a comprehensive overview of the candidate\'s background, skills, and experience relevant to the applied position." }}
             
              <!-- Professional resume content will be displayed here. This section provides a comprehensive overview of the candidate\'s background, skills, and experience relevant to the applied position. -->

</p>
          </div>
        </p-card>

        <!-- Personal Information -->
        <p-card header="Informations personnelles" styleClass="mb-4">
          <div class="grid">
            <div class="col-12 md:col-6">
              <div class="info-item">
                <label>Nom :</label>
                <span>{{ application.user?.firstname || 'N/A' }} {{ application.user?.lastname || '' }}</span>
              </div>
              
              <div class="info-item">
                <label>Email:</label>
                <span>{{ application.user?.email || 'N/A' }}</span>
              </div>
              
              <div class="info-item">
                <label>Phone:</label>
                <span>{{ application.user?.profile.phoneNumber || 'Not specified' }}</span>
              </div>
            </div>
            
            <div class="col-12 md:col-6">
              <div class="info-item">
                <label>Location:</label>
                <span>{{ application.user?.profile.adress || 'Not specified' }}</span>
              </div>
              
              <div class="info-item">
                <label>Niveau d'expérience :</label>
                <span>{{ application.user?.profile.experienceYears || 'Not specified' }} ans</span>
              </div>
              
              <div class="info-item">
                
                <span *ngFor="let education of application.user?.profile.education">
                <label>Education:</label>  
                {{education.degree || 'Not specified' }}</span>
              </div>
            </div>
          </div>
        </p-card>

        <!-- Technical Skills -->
        <p-card header="Compétences techniques" styleClass="mb-4">
          <div class="skills-container">
            <!-- <div class="skill-category" *ngIf="application.user?.skills?.programming"> -->
              <div class="skill-category">
              <!-- <h4>Programming Languages</h4> -->
              <div class="skill-tags">
                <p-tag 
                  *ngFor="let skill of application.extractedSkills" 
                  [value]="skill"
                  styleClass="mr-2 mb-2 skill-tag">
                </p-tag>
              </div>
            </div>
            
           
          </div>
        </p-card>
        

        <!-- Admin Comments -->
        <p-card header="Commentaires des RH" styleClass="mb-4">
          
              <!-- Display existing comments -->
              <div class="comments-list mb-4" *ngIf="application.adminComments?.length">
                <p-timeline 
                  [value]="getCommentsTimeline()" 
                  layout="vertical"
                  styleClass="custom-timeline">
                  <ng-template pTemplate="content" let-comment>
                    <div class="comment-content">
                      <p class="comment-text">{{ comment.text }}</p>
                      <small class="comment-date">{{ comment.date | date:'dd/MM/yyyy HH:mm' }}</small>
                    </div>
                  </ng-template>
                  <ng-template pTemplate="opposite" let-comment>
                    <small class="comment-author">{{ comment.author }}</small>
                  </ng-template>
                </p-timeline>
              </div>
          <div class="comments-section">
            <textarea 
              pInputTextarea 
              [(ngModel)]="newComment" 
              placeholder="Ajoutez vos commentaires sur cette application..."
              rows="4"
              (keyup.enter)="addComment()"
            
              class="w-full">
            </textarea>
            <div class="mt-2 flex justify-content-end">
              <p-button 
                label="Save Comments" 
                icon="pi pi-check" 
                (click)="addComment()"
                styleClass="p-button-success"
                size="small">
              </p-button>
            </div>
          </div>
        </p-card>

        <!-- Interview Information -->
        <!-- <p-card header="Interview Information" styleClass="mb-4" *ngIf="application.interview">
          <div class="interview-details">
            <div class="info-item">
              <label>Interview Date:</label>
              <span>{{ application.interview.scheduledDate | date:'medium' }}</span>
            </div>
            
            <div class="info-item">
              <label>Interview Type:</label>
              <span>{{ application.interview?.type || 'Not specified' }}</span>
            </div>
            
            <div class="info-item">
              <label>Interviewer:</label>
              <span>{{ application.interview?.interviewer || 'Not specified' }}</span>
            </div>
            
            <div class="info-item">
              <label>Status:</label>
              <p-tag 
                [value]="application.interview?.status" 
                [severity]="getStatusSeverity(application.interview?.status)">
              </p-tag>
            </div>
          </div>
        </p-card> -->

        <!-- Status Update -->
        <p-card header="Mise à jour du statut de la candidature" styleClass="mb-4">
          <div class="status-update">
            <p-dropdown 
              [options]="statusOptions" 
              [(ngModel)]="application.status"
              optionLabel="label" 
              optionValue="value"
              placeholder="Select Status"
              class="mr-2">
            </p-dropdown>
            <p-button 
              label="Mise à jour du statut" 
              icon="pi pi-refresh" 
              styleClass="p-button-primary"
              (click)="updateStatus(application.status)">
            </p-button>
          </div>
        </p-card>
      </div>
    </div>

    <!-- Back Button -->
    <div class="mt-4">
      <p-button 
        label="Retourner vers les candidatures" 
        icon="pi pi-arrow-left" 
        styleClass="p-button-outlined"
        (click)="goBack()">
      </p-button>
    </div>
  </div>
</div>

<p-toast></p-toast>
  `,
  styles: [`
    .application-details-container {
      /* 
  padding: 1.5rem;
  max-width: 1400px;
  margin: 0 auto; */
  padding: 1.5rem;
      max-width: 1400px;
      margin: 0 auto;
      /* background: #f8f9fa; */
      min-height: 100vh;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}

.application-content {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Basic Information Styles */
.application-info .info-item {
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e9ecef;
}

.application-info .info-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.application-info .info-item label {
  display: block;
  font-weight: 600;
  color: #6c757d;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
}

.application-info .info-item span {
  color: #495057;
  font-size: 0.9rem;
}

/* Status Tag Styles */
.status-tag {
  font-size: 0.75rem !important;
  padding: 0.25rem 0.5rem !important;
  border-radius: 6px !important;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.action-buttons .p-button {
  justify-content: flex-start;
}

/* Section Title */
.section-title {
  color: #495057;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  /* border-bottom: 2px solid #007bff; */
  padding-bottom: 0.5rem;
}

/* Resume Content */
.resume-content {
  line-height: 1.6;
  color: #6c757d;
  text-align: justify;
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #007bff;
}

/* Skills Container */
.skills-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.skill-category h4 {
  color: #495057;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  padding-bottom: 0.25rem;
  border-bottom: 1px solid #dee2e6;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-tag {
  background-color: #e3f2fd !important;
  color: #1976d2 !important;
  font-size: 0.8rem !important;
  padding: 0.25rem 0.5rem !important;
  border-radius: 4px !important;
}

/* Comments Section */
.comments-section textarea {
  resize: vertical;
  min-height: 100px;
}

/* Interview Details */
.interview-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.interview-details .info-item {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  border-left: 3px solid #007bff;
}

.interview-details .info-item label {
  display: block;
  font-weight: 600;
  color: #6c757d;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.interview-details .info-item span {
  color: #495057;
  font-weight: 500;
}

/* Status Update */
.status-update {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.status-update .p-dropdown {
  min-width: 200px;
}

/* Card Header Customization */
::ng-deep .p-card-header {
  /* background-color: #f8f9fa; */
  border-bottom: 1px solid #dee2e6;
  padding: 1rem 1.5rem;
  font-weight: 600;
  color: #495057;
}

/* Card Body */
::ng-deep .p-card-body {
  padding: 1.5rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .application-details-container {
    padding: 1rem;
  }
  
  .status-update {
    flex-direction: column;
    align-items: stretch;
  }
  
  .status-update .p-dropdown {
    min-width: auto;
    width: 100%;
    margin-bottom: 1rem;
  }
  
  .skills-container {
    gap: 1rem;
  }
  
  .skill-tags {
    gap: 0.25rem;
  }
}

/* Hover Effects */
.p-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

/* Button Hover Effects */
.p-button:hover {
  transform: translateY(-1px);
  transition: transform 0.2s ease;
}

/* Tag Hover Effects */
.skill-tag:hover {
  transform: scale(1.05);
  transition: transform 0.2s ease;
}

/* Breadcrumb Styling */
::ng-deep .p-breadcrumb {
  background-color: transparent;
  border: none;
  padding: 0;
  margin-bottom: 1.5rem;
}

::ng-deep .p-breadcrumb .p-breadcrumb-list {
  background-color: #f8f9fa;
  border-radius: 6px;
  padding: 0.75rem 1rem;
}

/* Loading Spinner */
::ng-deep .p-progress-spinner {
  width: 50px;
  height: 50px;
}

/* Toast Positioning */
::ng-deep .p-toast {
  z-index: 1050;
}

/* Print Styles */
@media print {
  .action-buttons,
  .status-update,
  .p-button {
    display: none !important;
  }
  
  .application-details-container {
    padding: 0;
    max-width: none;
  }
  
  .p-card {
    box-shadow: none !important;
    border: 1px solid #dee2e6 !important;
  }
}
  `],
  providers: [MessageService]
})
export class ApplicationDetailsComponent implements OnInit {
  

   application: Application = new Application();
  loading: boolean = true;
  applicationId: number = 0;
  newComment: string = '';

  statusOptions = [
    { label: 'Pending', value: 'PENDING', severity: 'warning' },
    { label: 'Approved', value: 'APPROVED', severity: 'success' },
    { label: 'Rejected', value: 'REJECTED', severity: 'danger' },
    { label: 'Interview', value: 'INTERVIEW', severity: 'info' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private applicationService: ApplicationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {

    this.applicationId = +this.route.snapshot.paramMap.get('id')!;
    this.loadApplicationDetails();
   
  }

  loadApplicationDetails(): void {
    this.loading = true;
    // Assuming you have a method to get application by ID
    // For now, using getUserApplications as reference
    this.applicationService.findById(this.applicationId).subscribe({
      next: (data: any) => {
        console.log('Application details loaded:', data);
        this.application = data;


         // Check if extractedSkills is string, parse it
      if (typeof this.application.extractedSkills === 'string') {
        try {
          this.application.extractedSkills = JSON.parse(this.application.extractedSkills);
        } catch (error) {
          console.error('Failed to parse extractedSkills', error);
          this.application.extractedSkills = [];
        }
      }

        this.loading = false;
       
       /*  console.log('applicant skills:', this.application.extractedSkills); */
      },
      error: (error) => {
        console.error('Error loading application details:', error);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load application details'
        });
      }
    });
  }

  downloadCV(): void {
    if (this.application.user?.id) {
      this.applicationService.downloadCv(this.application.user.id).subscribe({
        next: (response: any) => {
          // Handle CV download
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'CV downloaded successfully'
          });
        },
        error: (error) => {
          console.error('Error downloading CV:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to download CV'
          });
        }
      });
    }
  }

  scheduleInterview(): void {
    // Implement interview scheduling logic
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Interview scheduling feature coming soon'
    });
  }

  deleteApplication(): void {
    if (confirm('Are you sure you want to delete this application?')) {
      this.applicationService.delelteApplication(this.application.applicationId).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Application deleted successfully'
          });
          this.router.navigate(['/applications']);
        },
        error: (error) => {
          console.error('Error deleting application:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete application'
          });
        }
      });
    }
  }

  updateStatus(newStatus: string): void {
    // Implement status update logic
    this.application.status = newStatus as 'PENDING' | 'APPROVED' | 'REJECTED' | 'INTERVIEW';

  this.applicationService.updateStatus(this.applicationId,newStatus).subscribe({
    next:()=>{
      console.log(`Application ${this.applicationId} status updated to ${newStatus}`);
      //this.application.status = newStatus;
      this.messageService.add({
        severity: 'success',
        summary: 'Status Updated',
        detail: `Application status changed to ${newStatus}`
      });
    }
    ,error:(error)=>{
      console.error('Error updating application status:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update application status'
      });
    }
  })


    /* this.messageService.add({
      severity: 'info',
      summary: 'Status Updated',
      detail: `Application status changed to ${newStatus}`
    }); */
  }

  getStatusSeverity(status: string): string {
    const statusOption = this.statusOptions.find(option => option.value === status);
    return statusOption ? statusOption.severity : 'info';
  }

  goBack(): void {
    this.router.navigate(['/applications']);
  }

  getCommentsTimeline(): any[] {
    if (!this.application.adminComments || this.application.adminComments.length === 0) {
      return [];
    }
    
    return this.application.adminComments.map((comment, index) => ({
      text: comment,
      date: new Date(), // You might want to store actual dates
      author: 'HR Team' // You might want to store actual author names
    }));
  }

 addComment(): void {
    if (!this.newComment.trim()) {
      return;
    }

    // Initialize array if it doesn't exist
    if (!this.application.adminComments) {
      this.application.adminComments = [];
    }

    // Add the new comment to the array
    this.application.adminComments.push(this.newComment.trim());

    // Clear the input
    this.newComment = '';

    // Here you would typically call a service to save the updated comments
    // For now, we'll just show a success message
    this.messageService.add({
      severity: 'success',
      summary: 'Commentaire ajouté',
      detail: 'Le commentaire a été ajouté avec succès'
    });

    // TODO: Call your backend service to save the comments
    this.applicationService.addComments(this.applicationId, this.application.adminComments).subscribe({
       next: () => {
         this.messageService.add({
           severity: 'success',
           summary: 'Commentaire ajouté',
           detail: 'Le commentaire a été sauvegardé avec succès'
         });
       },
       error: (error) => {
         console.error('Error saving comment:', error);
       this.messageService.add({
           severity: 'error',
           summary: 'Erreur',
           detail: 'Impossible de sauvegarder le commentaire'
         });
       }
     });
  }
}