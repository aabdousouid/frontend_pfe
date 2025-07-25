import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { Job } from '../../../shared/models/job';
import { JobsService } from '../../../shared/services/jobs.service';
import { StorageService } from '../../../shared/services/storage.service';

export interface JobOffer {
  id: number;
  title: string;
  description: string;
  publishedDate: string;
  internshipType?: string;
}

export interface RecruitmentStep {
  step: number;
  title: string;
  description: string;
  completed?: boolean;
}

@Component({
  selector: 'app-job-application',
  standalone: true,
  imports:[
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    
    
    // PrimeNG Modules
    ButtonModule,
    InputTextModule,
    FileUploadModule,
    MessageModule,
    ToastModule,
    BreadcrumbModule,
    CardModule,
    DividerModule,
    ProgressBarModule
  ],
  template: `<div class="job-application-container">
  <!-- Header with Breadcrumb -->
  <div class="header-section">
    <p-breadcrumb [model]="[
      {label: 'Offres demploi', routerLink: '/apps/jobs'},
      {label: job?.title, routerLink: '/jobs/ux-ui-designer'},
      {label: 'Postuler'}
    ]" class="mb-4"></p-breadcrumb>
    
    <div class="admin-info">
      <i class="pi pi-calendar"></i>
      <span>2025-05-04 13:11:30</span>
      <i class="pi pi-user ml-3"></i>
      <span>Admin Login</span>
    </div>
  </div>

  <!-- Info Alert -->
  <p-message 
    severity="info" 
    text="Vous ne pouvez postuler qu'une seule fois à cette offre avec la même adresse email."
    class="mb-4">
  </p-message>

  <div class="content-grid">
    <!-- Application Form -->
    <div class="form-section">
      <div class="form-card">
        <h2 class="form-title">
          <i class="pi pi-file-edit"></i>
          Formulaire de candidature - {{job?.title}}
        </h2>

        <form [formGroup]="applicationForm" (ngSubmit)="onSubmit()">
          <!-- Full Name Field -->
          <div class="field">
            <label for="fullName" class="required-field">Nom complet *</label>
            <input 
              id="fullName"
              type="text" 
              [(ngModel)]="this.user.username"
              pInputText 
              formControlName="fullName"
              [class.ng-invalid]="isFieldInvalid('fullName')"
              placeholder="Votre nom complet"
              class="w-full" />
            <small 
              *ngIf="getFieldError('fullName')" 
              class="p-error">
              {{ getFieldError('fullName') }}
            </small>
          </div>

          <!-- Email Field -->
          <div class="field">
            <label for="email" class="required-field">Email *</label>
            <input 
              id="email"
              type="email" 
              pInputText 
              [(ngModel)]="this.user.email"
              formControlName="email"
              [class.ng-invalid]="isFieldInvalid('email')"
              placeholder="votre.email@exemple.com"
              class="w-full" />
            <small class="field-hint">
              Nous utiliserons cette adresse pour vous contacter. Vous ne pourrez pas soumettre plusieurs candidatures avec le même email pour cette offre.
            </small>
            <small 
              *ngIf="getFieldError('email')" 
              class="p-error">
              {{ getFieldError('email') }}
            </small>
          </div>

          <!-- CV Upload Field -->
          <div class="field">
            <label class="required-field">CV (PDF uniquement) *</label>
            <p-fileUpload 
              #fileUpload
              mode="basic" 
              name="cv"
              accept=".pdf"
              [maxFileSize]="maxFileSize"
              [auto]="false"
              chooseLabel="Choisir un fichier"
              (onSelect)="onFileSelect($event)"
              (onRemove)="onFileRemove()"
              [showUploadButton]="false"
              [showCancelButton]="false"
              class="upload-field">
            </p-fileUpload>
            
            <!-- File Info -->
            <div *ngIf="uploadedFiles.length > 0" class="file-info mt-2">
              <div class="uploaded-file">
                <i class="pi pi-file-pdf text-red-500"></i>
                <span>{{ uploadedFiles[0].name }}</span>
                <span class="file-size">({{ (uploadedFiles[0].size / 1024 / 1024).toFixed(2) }} MB)</span>
                <button 
                  type="button" 
                  pButton 
                  icon="pi pi-times" 
                  class="p-button-text p-button-sm"
                  (click)="onFileRemove()">
                </button>
              </div>
            </div>
            
            <small class="field-hint">Taille maximale: 5 MB.</small>
            <small 
              *ngIf="getFieldError('cv')" 
              class="p-error">
              Ce champ est requis
            </small>
          </div>

          <!-- Action Buttons -->
          <div class="form-actions">
            <button 
              type="submit"
              pButton 
              label="Soumettre ma candidature"
              icon="pi pi-send"
              class="p-button-success submit-btn"
              [loading]="loading"
              [disabled]="!applicationForm.valid">
            </button>
            
            <button 
              type="button"
              pButton 
              label="Annuler"
              class="p-button-outlined cancel-btn"
              (click)="onCancel()">
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Job Info Sidebar -->
    <div class="info-section">
      <!-- Job Details Card -->
      <div class="info-card" *ngIf="jobOffer">
        <h3 class="info-title">Informations sur l'offre</h3>
        
        <div class="job-header">
          <h4>{{ job?.title }}</h4>
          <span *ngIf="job?.jobType" class="stage-badge">
            {{ job?.jobType }}
          </span>
          
        </div>
        
        <p class="job-description">{{ job?.description }}</p>
        
        <div class="publish-date">
          <i class="pi pi-calendar"></i>
          <span>Publié le {{ job?.postedDate | date:'dd/MM/yyyy HH:mm' }}</span>
        </div>
      </div>

      <!-- Recruitment Process Card -->
      <div class="info-card process-card">
        <h3 class="info-title">Processus de recrutement</h3>
        
        <div class="recruitment-steps">
          <div 
            *ngFor="let step of recruitmentSteps; let i = index" 
            class="step-item"
            [class.active]="i === 0">
            <div class="step-number">{{ step.step }}</div>
            <div class="step-content">
              <h5>{{ step.title }}</h5>
              <p>{{ step.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Toast Messages -->
<p-toast></p-toast>`,
  styles: [`.job-application-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  background-color: #f8f9fa;
  min-height: 100vh;

  .header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    background: white;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    .admin-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #6c757d;
      font-size: 0.875rem;

      .pi {
        font-size: 0.75rem;
      }
    }
  }

  .content-grid {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 2rem;

    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }

  .form-section {
    .form-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;

      .form-title {
        background: #f8f9fa;
        padding: 1.5rem;
        margin: 0;
        border-bottom: 1px solid #dee2e6;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 1.25rem;
        color: #495057;

        .pi {
          color: #007bff;
        }
      }

      form {
        padding: 2rem;

        .field {
          margin-bottom: 2rem;

          label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: #495057;

            &.required-field::after {
              content: ' *';
              color: #dc3545;
            }
          }

          .field-hint {
            display: block;
            margin-top: 0.5rem;
            color: #6c757d;
            font-size: 0.875rem;
            line-height: 1.4;
          }

          .p-error {
            display: block;
            margin-top: 0.5rem;
            color: #dc3545;
            font-size: 0.875rem;
          }

          input {
            border: 1px solid #ced4da;
            border-radius: 4px;
            padding: 0.75rem;
            font-size: 1rem;
            transition: border-color 0.2s;

            &:focus {
              border-color: #007bff;
              box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
            }

            &.ng-invalid.ng-touched {
              border-color: #dc3545;
            }
          }

          .upload-field {
            .p-fileupload-basic {
              .p-button {
                background: #f8f9fa;
                border: 2px dashed #ced4da;
                color: #6c757d;
                padding: 1rem;
                border-radius: 4px;
                width: 100%;
                transition: all 0.2s;

                &:hover {
                  background: #e9ecef;
                  border-color: #007bff;
                  color: #007bff;
                }
              }
            }
          }

          .file-info {
            .uploaded-file {
              display: flex;
              align-items: center;
              gap: 0.5rem;
              padding: 0.75rem;
              background: #f8f9fa;
              border: 1px solid #dee2e6;
              border-radius: 4px;

              .file-size {
                color: #6c757d;
                font-size: 0.875rem;
              }

              .p-button {
                margin-left: auto;
              }
            }
          }
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;

          .submit-btn {
            flex: 1;
            padding: 0.875rem 2rem;
            font-size: 1rem;
            font-weight: 600;
          }

          .cancel-btn {
            padding: 0.875rem 2rem;
            font-size: 1rem;
          }

          @media (max-width: 576px) {
            flex-direction: column;
          }
        }
      }
    }
  }

  .info-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    .info-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;

      .info-title {
        background: #f8f9fa;
        padding: 1rem 1.5rem;
        margin: 0;
        border-bottom: 1px solid #dee2e6;
        font-size: 1.1rem;
        color: #495057;
        font-weight: 600;
      }

      .job-header {
        padding: 1.5rem;
        border-bottom: 1px solid #f0f0f0;

        h4 {
          margin: 0 0 0.5rem 0;
          color: #2c3e50;
          font-size: 1.25rem;
        }

        .stage-badge {
          background: #17a2b8;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .alternance-badge {
          background: #17a2b8;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .cdi-badge {
          background: #38F287;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .stageete-badge {
          background: #17a2b8;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
        }
      }

      .job-description {
        padding: 0 1.5rem 1.5rem;
        color: #6c757d;
        line-height: 1.6;
        margin: 0;
      }

      .publish-date {
        padding: 0 1.5rem 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #6c757d;
        font-size: 0.875rem;

        .pi {
          color: #007bff;
        }
      }

      &.process-card {
        .recruitment-steps {
          padding: 1.5rem;

          .step-item {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            margin-bottom: 1.5rem;
            position: relative;

            &:not(:last-child)::after {
              content: '';
              position: absolute;
              left: 15px;
              top: 40px;
              bottom: -15px;
              width: 2px;
              background: #e9ecef;
            }

            &.active {
              .step-number {
                background: #28a745;
                color: white;
              }

              &::after {
                background: #28a745;
              }
            }

            .step-number {
              min-width: 30px;
              height: 30px;
              border-radius: 50%;
              background: #e9ecef;
              color: #6c757d;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 600;
              font-size: 0.875rem;
              position: relative;
              z-index: 1;
            }

            .step-content {
              flex: 1;

              h5 {
                margin: 0 0 0.5rem 0;
                color: #2c3e50;
                font-size: 1rem;
              }

              p {
                margin: 0;
                color: #6c757d;
                font-size: 0.875rem;
                line-height: 1.5;
              }
            }

            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }
    }
  }
}

// Global PrimeNG customizations
::ng-deep {
  .p-message {
    margin-bottom: 1rem;

    .p-message-wrapper {
      border-radius: 8px;
      background: #cce7ff;
      border: 1px solid #b8daff;
      color: #004085;
    }
  }

  .p-breadcrumb {
    background: transparent;
    border: none;
    padding: 0;

    .p-breadcrumb-list {
      .p-breadcrumb-item {
        .p-breadcrumb-link {
          color: #007bff;
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }

        .p-breadcrumb-separator {
          color: #6c757d;
        }
      }
    }
  }

  .p-fileupload {
    .p-fileupload-buttonbar {
      display: none;
    }
  }

  .p-toast {
    .p-toast-message {
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }
}

// Responsive design
@media (max-width: 768px) {
  .job-application-container {
    padding: 0.5rem;

    .content-grid {
      grid-template-columns: 1fr;
    }

    .form-section .form-card form {
      padding: 1rem;
    }

    .info-section .info-card {
      .job-header,
      .job-description,
      .publish-date {
        padding: 1rem;
      }

      &.process-card .recruitment-steps {
        padding: 1rem;
      }
    }
  }
}`],
providers: [MessageService]
})
export class JobApplicationComponent implements OnInit {
  applicationForm: FormGroup;
  jobOffer: JobOffer | null = null;
  job:Job | null = null;
  uploadedFiles: any[] = [];
  maxFileSize = 5000000; // 5MB
  user:any;
  loading = false;
  //jobId: number | null = null;
  jobId:number = null as any;
  recruitmentSteps: RecruitmentStep[] = [
    {
      step: 1,
      title: 'Candidature',
      description: 'Soumission du CV et des informations de contact.'
    },
    {
      step: 2,
      title: 'Analyse',
      description: 'Analyse de votre candidature par notre système et équipe.'
    },
    {
      step: 3,
      title: 'Réponse',
      description: 'Vous recevrez une réponse par email.'
    },
    {
      step: 4,
      title: 'Entretien',
      description: 'Si votre candidature est retenue, vous serez invité à un entretien.'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private jobService:JobsService,
    private storage: StorageService
  ) {
    this.applicationForm = this.fb.group({
      fullName: [this.user?.username, [Validators.required, Validators.minLength(2)]],
      email: [this.user?.email, [Validators.required, Validators.email]],
      cv: [null, Validators.required]
    });
  }

  ngOnInit() {
    // Mock job data - replace with actual service call
    this.user = this.storage.getUser();
    this.jobId = this.route.snapshot.params['id'];
    this.loadJobOffer();
    console.log(this.user);
  }

  loadJobOffer() {
    // This would typically come from a service
    this.jobService.getJobById(this.jobId).subscribe({
      next:(data=>{
        this.job = data;
        console.log('Job data loaded:', this.job);
      })
    })
    

    this.jobOffer = {
      id: this.jobId,
      title: this.job?.title || "Not found",
      description: this.job?.description || 'nous cherchons un·e UX/UI Designer créatif·ve pour améliorer l\'expérience utilisateur de ses plateformes digitales et interfaces embarquées. Vous serez responsable de la conception d\'interfaces intuitives, ergonomiques et esthétiques en lien avec les...',
      publishedDate:  this.job?.postedDate ? new Date(this.job.postedDate).toISOString() : new Date().toISOString(),
      internshipType:this.job?.jobType ||'Not found'
    };
  }

  onFileSelect(event: any) {
    const file = event.files[0];
    if (file) {
      if (file.size > this.maxFileSize) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Le fichier dépasse la taille maximale de 5MB'
        });
        return;
      }

      if (file.type !== 'application/pdf') {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Seuls les fichiers PDF sont acceptés'
        });
        return;
      }

      this.uploadedFiles = [file];
      this.applicationForm.patchValue({ cv: file });
      this.applicationForm.get('cv')?.updateValueAndValidity();
    }
  }

  onFileRemove() {
    this.uploadedFiles = [];
    this.applicationForm.patchValue({ cv: null });
    this.applicationForm.get('cv')?.updateValueAndValidity();
  }

  onSubmit() {
  if (this.applicationForm.valid) {
    this.loading = true;

    const formData = new FormData();

    if (this.uploadedFiles.length > 0) {
      formData.append('cv', this.uploadedFiles[0]);
    }

    this.submitApplication(formData);
  } else {
    this.markFormGroupTouched();
  }
}


private submitApplication(formData: FormData) {
  const userId = this.user?.id; // Assuming your user object contains `id`
  const jobId = this.jobId;

  if (!userId || !jobId) {
    this.messageService.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Utilisateur ou offre non trouvés.'
    });
    this.loading = false;
    return;
  }

  this.jobService.applyToJob(jobId, userId, formData).subscribe({
    next: () => {
      this.loading = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Votre candidature a été soumise avec succès!'
      });

      this.applicationForm.reset();
      this.uploadedFiles = [];
    },
    error: (error:any) => {
      this.loading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Une erreur est survenue lors de la soumission. Veuillez réessayer.'
      });
      console.error(error);
    }
  });
}


  private markFormGroupTouched() {
    Object.keys(this.applicationForm.controls).forEach(key => {
      const control = this.applicationForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel() {
    this.router.navigate(['/app/jobs']);
  }

  getFieldError(fieldName: string): string {
    const field = this.applicationForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `Ce champ est requis`;
      }
      if (field.errors['email']) {
        return 'Veuillez saisir une adresse email valide';
      }
      if (field.errors['minlength']) {
        return `Minimum ${field.errors['minlength'].requiredLength} caractères requis`;
      }
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.applicationForm.get(fieldName);
    return !!(field?.invalid && field.touched);
  }
}