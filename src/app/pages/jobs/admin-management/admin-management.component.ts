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
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MenuModule } from 'primeng/menu';
import { SplitButtonModule } from 'primeng/splitbutton';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CheckboxModule } from 'primeng/checkbox';

import { JobsService } from '../../../shared/services/jobs.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { StorageService } from '../../../shared/services/storage.service';
import { Router } from '@angular/router';
import { Job } from '../../../shared/models/job';
import { forkJoin } from 'rxjs';

interface JobStats {
  total: number;
  active: number;
  inactive: number;
  urgent: number;
  applications: number;
}

@Component({
  selector: 'app-admin-job-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    MultiSelectModule,
    TagModule,
    BadgeModule,
    PaginatorModule,
    SkeletonModule,
    RippleModule,
    TooltipModule,
    ChipModule,
    DividerModule,
    DialogModule,
    StepperModule,
    MessageModule,
    TextareaModule,
    SelectModule,
    ToggleSwitchModule,
    ToastModule,
    TableModule,
    ToolbarModule,
    ConfirmDialogModule,
    MenuModule,
    SplitButtonModule,
    OverlayPanelModule,
    CheckboxModule,
    ToggleButtonModule
  ],
  templateUrl: './admin-management.component.html',
  styleUrl: './admin-management.component.scss',
  providers: [MessageService, ConfirmationService]
})
export class AdminJobManagementComponent implements OnInit {
  
  // Data Properties
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  selectedJobs: Job[] = [];
  jobStats: JobStats = {
    total: 0,
    active: 0,
    inactive: 0,
    urgent: 0,
    applications: 0
  };

  // Dialog Properties
  displayJobDialog: boolean = false;
  displayCreateDialog: boolean = false;
  displayBulkEditDialog: boolean = false;
  selectedJob: Job = {} as Job;
  isEditMode: boolean = false;

  // Form Properties
  activeStep: number = 1;
  customSkillInput: string = '';
  isSubmitting: boolean = false;
  
  form: any = {
    title: '',
    company: '',
    description: '',
    location: '',
    jobType: '',
    experience: '',
    requirements: '',
    skills: [],
    postedDate: new Date(),
    isActive: true,
    isUrgent: false,
  };

  // Filter Properties
  searchQuery: string = '';
  selectedLocation: string = '';
  selectedJobType: string = '';
  selectedStatus: string = '';
  selectedDateRange: string = '';

  // UI Properties
  loading: boolean = true;
  lastUpdated: Date = new Date();
  viewMode: 'table' | 'grid' = 'table';

  // Dropdown Options
  dropdownValues = [
    { name: 'ACTIA ES' },
    { name: 'CIPI ACTIA' },
    { name: 'ACTIA AFRICA' },
    { name: 'ACTIA Paris' }
  ];

  dropdownValuesJob = [
    { name: "Contrat CDI", value: 'CDI' },
    { name: "Stage de fin d'étude (PFE)", value: 'STAGE_PFE' },
    { name: "Stage d'été", value: 'STAGE_ETE' },
    { name: "Contrat alternance", value: 'ALTERNANCE' },
  ];

  statusOptions = [
    { label: 'Tous les statuts', value: '' },
    { label: 'Actif', value: 'active' },
    { label: 'Inactif', value: 'inactive' },
    { label: 'Urgent', value: 'urgent' }
  ];

  dateRangeOptions = [
    { label: 'Toutes les dates', value: '' },
    { label: 'Dernières 24h', value: '1d' },
    { label: '7 derniers jours', value: '7d' },
    { label: '30 derniers jours', value: '30d' },
    { label: '90 derniers jours', value: '90d' }
  ];

  // Skills for toggles
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

  // Toggle states
  option1: boolean = false;
  option2: boolean = false;
  option3: boolean = false;
  option4: boolean = false;
  option5: boolean = false;
  option6: boolean = false;
  option7: boolean = false;
  option8: boolean = false;
  option9: boolean = false;
  option10: boolean = false;

  // Bulk actions
  bulkActions = [
    { label: 'Activer', icon: 'pi pi-check', command: () => this.bulkActivate() },
    { label: 'Désactiver', icon: 'pi pi-times', command: () => this.bulkDeactivate() },
    { label: 'Marquer urgent', icon: 'pi pi-exclamation-triangle', command: () => this.bulkMarkUrgent() },
    { label: 'Supprimer', icon: 'pi pi-trash', command: () => this.bulkDelete() }
  ];

  constructor(
    private jobService: JobsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private storageService: StorageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadJobs();
  }

  loadJobs() {
    this.loading = true;
    this.jobService.getAllJobs().subscribe({
      next: (data) => {
      this.jobs = data.map((job: any) => ({
        ...job,
        postedDate: new Date(job.postedDate),
        skills: Array.isArray(job.skills) ? job.skills : [],
        // ✅ keep requirements as a string; don't force array
        requirements: typeof job.requirements === 'string' ? job.requirements : ''
      }));
        
        this.filteredJobs = [...this.jobs];
        this.calculateStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching jobs:', error);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les offres d\'emploi'
        });
      }
    });
  }

  calculateStats() {
    this.jobStats = {
      total: this.jobs.length,
      active: this.jobs.filter(job => job.isActive).length,
      inactive: this.jobs.filter(job => !job.isActive).length,
      urgent: this.jobs.filter(job => job.isUrgent).length,
      applications: 0 // This would come from your applications service
    };
  }

  applyFilters() {
    this.filteredJobs = this.jobs.filter(job => {
      const matchesSearch = !this.searchQuery || 
        job.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(this.searchQuery.toLowerCase()));

      const matchesLocation = !this.selectedLocation || 
        job.location === this.selectedLocation;

      const matchesJobType = !this.selectedJobType || 
        job.jobType === this.selectedJobType;

      const matchesStatus = !this.selectedStatus || 
        (this.selectedStatus === 'active' && job.isActive) ||
        (this.selectedStatus === 'inactive' && !job.isActive) ||
        (this.selectedStatus === 'urgent' && job.isUrgent);

      const matchesDateRange = !this.selectedDateRange || 
        this.isWithinDateRange(job.postedDate, this.selectedDateRange);

      return matchesSearch && matchesLocation && matchesJobType && matchesStatus && matchesDateRange;
    });
  }

  isWithinDateRange(date: Date, range: string): boolean {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    switch (range) {
      case '1d': return diffDays <= 1;
      case '7d': return diffDays <= 7;
      case '30d': return diffDays <= 30;
      case '90d': return diffDays <= 90;
      default: return true;
    }
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedLocation = '';
    this.selectedJobType = '';
    this.selectedStatus = '';
    this.selectedDateRange = '';
    this.filteredJobs = [...this.jobs];
  }

  // Job Management Methods
  createNewJob() {
    this.resetForm();
    this.isEditMode = false;
    this.displayCreateDialog = true;
  }

  editJob(job: Job) {
    this.selectedJob = { ...job };
    this.populateForm(job);
    this.isEditMode = true;
    this.displayCreateDialog = true;
  }

  viewJobDetails(job: Job) {
    this.selectedJob = job;
    this.displayJobDialog = true;
  }

  toggleJobStatus(job: Job) {
    const activating = !job.isActive;
    const actionLabel = activating ? 'activer' : 'désactiver';

    this.confirmationService.confirm({
      message: `Voulez-vous ${actionLabel} cette offre d'emploi ?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const call$ = activating
          ? this.jobService.enableJob(job.jobId)
          : this.jobService.disableJob(job.jobId);

        call$.subscribe({
          next: (updated) => {
            // Optimistic local update (optional—loadJobs also refreshes)
            job.isActive = updated.isActive;
            this.messageService.add({
              severity: 'success',
              summary: `Offre ${activating ? 'activée' : 'désactivée'}`,
              detail: `« ${job.title} » a été ${activating ? 'activée' : 'désactivée'}`
            });
            this.calculateStats();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: `Impossible de ${actionLabel} l'offre`
            });
          }
        });
      }
    });
  }

  deleteJob(job: Job) {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer cette offre d\'emploi ?',
      header: 'Confirmer la suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.jobService.deleteJob(job.jobId).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Suppression réussie',
              detail: 'L\'offre d\'emploi a été supprimée'
            });
            this.loadJobs();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Impossible de supprimer l\'offre d\'emploi'
            });
          }
        });
      }
    });
  }

  updateJob(job: Job) {
    this.jobService.updateJob(job,job.jobId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Mise à jour réussie',
          detail: 'L\'offre d\'emploi a été mise à jour'
        });
        this.loadJobs();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de mettre à jour l\'offre d\'emploi'
        });
      }
    });
  }

  // Bulk Operations
  bulkActivate() {
    this.confirmationService.confirm({
      message: `Activer ${this.selectedJobs.length} offre(s) d'emploi ?`,
      header: 'Confirmation',
      icon: 'pi pi-check',
      accept: () => {
        const requests = this.selectedJobs.map(j => this.jobService.enableJob(j.jobId));
        forkJoin(requests).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Activation terminée',
              detail: `${this.selectedJobs.length} offre(s) activée(s)`
            });
            this.loadJobs();
            this.selectedJobs = [];
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: `Impossible d'activer certaines offres`
            });
          }
        });
      }
    });
  }

 bulkDeactivate() {
    this.confirmationService.confirm({
      message: `Désactiver ${this.selectedJobs.length} offre(s) d'emploi ?`,
      header: 'Confirmation',
      icon: 'pi pi-times',
      accept: () => {
        const requests = this.selectedJobs.map(j => this.jobService.disableJob(j.jobId));
        forkJoin(requests).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Désactivation terminée',
              detail: `${this.selectedJobs.length} offre(s) désactivée(s)`
            });
            this.loadJobs();
            this.selectedJobs = [];
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: `Impossible de désactiver certaines offres`
            });
          }
        });
      }
    });
  }
  bulkMarkUrgent() {
    this.confirmationService.confirm({
      message: `Marquer ${this.selectedJobs.length} offre(s) comme urgente(s) ?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.selectedJobs.forEach(job => {
          job.isUrgent = true;
          this.updateJob(job);
        });
        this.selectedJobs = [];
      }
    });
  }

  bulkDelete() {
    this.confirmationService.confirm({
      message: `Supprimer définitivement ${this.selectedJobs.length} offre(s) d'emploi ?`,
      header: 'Confirmer la suppression',
      icon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.selectedJobs.forEach(job => {
          this.jobService.deleteJob(job.jobId).subscribe({
            next: () => this.loadJobs(),
            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: `Impossible de supprimer ${job.title}`
              });
            }
          });
        });
        this.selectedJobs = [];
      }
    });
  }

  // Form Methods
  resetForm() {
    this.form = {
      title: '',
      company: '',
      description: '',
      location: '',
      jobType: '',
      experience: '',
      requirements: '',
      skills: [],
      postedDate: new Date(),
      isActive: true,
      isUrgent: false,
    };
    
    // Reset toggle buttons
    this.toggleSkills.forEach(skill => {
      (this as any)[skill.model] = false;
    });
    
    this.customSkillInput = '';
    this.activeStep = 1;
  }

  populateForm(job: Job) {
  this.form = {
    title: job.title,
    company: job.company,
    description: job.description,

    // map to the matching option object
    location: this.dropdownValues.find(o => o.name === job.location) ?? { name: job.location },

    // map to the matching option object (value = enum/string)
    jobType: this.dropdownValuesJob.find(o => o.value === job.jobType)
             ?? { name: job.jobType, value: job.jobType },

    experience: job.experience,
    // Your backend stores requirements as a STRING; don’t coerce to array:
    requirements: typeof job.requirements === 'string' ? job.requirements : '',
    skills: Array.isArray(job.skills) ? [...job.skills] : [],
    postedDate: job.postedDate instanceof Date ? job.postedDate : new Date(job.postedDate),
    isActive: !!job.isActive,
    isUrgent: !!job.isUrgent
  };

  // (optional) reflect skill chips into toggles
  this.toggleSkills.forEach(s => (this as any)[s.model] = this.form.skills.includes(s.label));
}


  nextStep() {
    if (this.activeStep < 3) {
      this.activeStep++;
    }
  }

  previousStep() {
    if (this.activeStep > 1) {
      this.activeStep--;
    }
  }

  isSkillSelected(skillModel: string): boolean {
    return (this as any)[skillModel] === true;
  }

  toggleSkill(skillModel: string) {
    (this as any)[skillModel] = !(this as any)[skillModel];
    this.updateRequirements();
  }

  updateRequirements() {
    const toggled = this.toggleSkills
      .filter(skill => (this as any)[skill.model])
      .map(skill => skill.label);

    const custom = this.form.skills.filter(
      (skill: string) => !this.toggleSkills.some(ts => ts.label === skill)
    );

    this.form.skills = [...toggled, ...custom];
  }

  addCustomSkill() {
    const skill = this.customSkillInput.trim();
    if (skill && !this.form.skills.includes(skill)) {
      this.form.skills.push(skill);
      this.customSkillInput = '';
    }
  }

  removeSkill(index: number): void {
    const removedSkill = this.form.skills[index];
    this.form.skills.splice(index, 1);
    const toggleSkill = this.toggleSkills.find(t => t.label === removedSkill);
    if (toggleSkill) {
      (this as any)[toggleSkill.model] = false;
    }
  }

  onSubmit() {
  this.updateRequirements();
  this.isSubmitting = true;

  const jobData = {
    ...this.form,
    jobType: this.form.jobType?.value || this.form.jobType,
    location: this.form.location?.name || this.form.location
  };

  const op$ = this.isEditMode
    
    ? this.jobService.updateJob({ ...jobData, jobId: this.selectedJob.jobId }, this.selectedJob.jobId)
    : this.jobService.addJob(jobData);

  op$.subscribe({
    next: () => {
      this.messageService.add({
        severity: 'success',
        summary: this.isEditMode ? 'Offre mise à jour' : 'Offre créée',
        detail: this.isEditMode
          ? 'L\'offre d\'emploi a été mise à jour avec succès'
          : 'L\'offre d\'emploi a été créée avec succès'
      });
      this.resetForm();
      this.displayCreateDialog = false;
      this.loadJobs();
      this.isSubmitting = false;
    },
    error: () => {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Une erreur est survenue. Veuillez réessayer.'
      });
      this.isSubmitting = false;
    }
  });
}


  // Utility Methods
  getJobTypeSeverity(type: string): string {
    switch (type) {
      case 'CDI': return 'success';
      case 'STAGE_PFE': return 'info';
      case 'ALTERNANCE': return 'warn';
      case 'STAGE_ETE': return 'secondary';
      default: return 'info';
    }
  }

  getTimeAgo(date: Date | string): string {
    const now = new Date();
    const jobDate = date instanceof Date ? date : new Date(date);
    const diffTime = Math.abs(now.getTime() - jobDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Il y a 1 jour';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
    }
    
    const months = Math.floor(diffDays / 30);
    return `Il y a ${months} mois`;
  }

  viewApplications(job: Job) {
    this.router.navigate(['/admin/applications', job.jobId]);
  }

  exportJobs() {
    // Implement export functionality
    this.messageService.add({
      severity: 'info',
      summary: 'Export',
      detail: 'Fonctionnalité d\'export en cours de développement'
    });
  }
}