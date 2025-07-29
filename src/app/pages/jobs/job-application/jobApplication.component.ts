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
import { ApplicationService } from '../../../shared/services/application.service';

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
  templateUrl: './jobApplication.component.html',
  styleUrl:'./jobApplication.component.scss',
providers: [MessageService]
})
export class JobApplicationComponent implements OnInit {
  applicationForm: FormGroup;
  jobOffer: JobOffer | null = null;
  job:Job | null = null;
  uploadedFiles: any[] = [];  
  currentDate :Date = new Date();
  maxFileSize = 5000000; // 5MB
  user:any;
  loading = false;
  applied:any;
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
    private storage: StorageService,
    private applicationService:ApplicationService,
    
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
    //console.log(this.job);
    this.applicationService.findByUserAndJob(this.user.id,this.jobId).subscribe({
      next:(data=>{
        this.applied =data;
      })
    })
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
      this.router.navigate(['/app/jobs']);
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