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
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { StorageService } from '../../../../shared/services/storage.service';
import { ApplicationService } from '../../../../shared/services/application.service';
import { Application } from '../../../../shared/models/application';
import { Interview } from '../../../../shared/models/interview';
import { InterviewService } from '../../../../shared/services/interview.service';
import { UserInterviewsComponent } from '../../interviews/user-interviews/user-interviews.component';
import { JobsService } from '../../../../shared/services/jobs.service';

@Component({
  selector: 'app-application-list',
  standalone: true,
  imports: [
    TableModule,
    UserInterviewsComponent,
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
    ProgressBarModule,
    StepperModule,
    MessageModule,
    SelectModule,
    ToggleSwitchModule
  ],
  templateUrl:'./applicationsUserList.component.html',
  styleUrl: './applicationsUserList.component.scss',
  providers: [MessageService]
})
export class ApplicationUserListComponent implements OnInit {
  applications: Application[] = [];
  filteredApplications: Application[] = [];
  selectedStatus: string = 'Tous';
  selectedSort: string = 'appliedDate_desc';
  loading: boolean = false;
  userId:any;
  interviews!:Interview[];

  statusOptions = [
    { label: 'Tous', value: 'Tous' },
    { label: 'En attente', value: 'PENDING' },
    { label: 'Approuvées', value: 'APPROVED' },
    { label: 'Rejetées', value: 'REJECTED' },
    { label: 'Entretien', value: 'INTERVIEW' }
  ];

  statusOptionsForDropdown = [
    { label: 'En attente', value: 'PENDING' },
    { label: 'Approuvée', value: 'APPROVED' },
    { label: 'Rejetée', value: 'REJECTED' },
    { label: 'Entretien', value: 'INTERVIEW' }
  ];

  sortOptions = [
    { label: 'Date (plus récent)', value: 'appliedDate_desc' },
    { label: 'Date (plus ancien)', value: 'appliedDate_asc' },
    { label: 'Nom du candidat (A-Z)', value: 'username_asc' },
    { label: 'Nom du candidat (Z-A)', value: 'username_desc' },
    { label: 'Poste (A-Z)', value: 'jobTitle_asc' },
    { label: 'Statut', value: 'status_asc' }
  ];

  

statusOptionsIfApproved = [
  { label: 'Approuvé', value: 'APPROVED', severity: 'success' },
  { label: 'Entretien programmé', value: 'INTERVIEW', severity: 'info' },
  { label: 'Rejeté', value: 'REJECTED', severity: 'danger' },

]

statusOptionsIfPending = [
  { label: 'En attente', value: 'PENDING', severity: 'warning' },
  { label: 'Approuvé', value: 'APPROVED', severity: 'success' },
  { label: 'Rejeté', value: 'REJECTED', severity: 'danger' },

]

statusOptionsIfInterview = [
  { label: 'Entretien programmé', value: 'INTERVIEW', severity: 'info' },
  { label: 'Embauché', value: 'HIRED', severity: 'primary' },
  { label: 'Rejeté', value: 'REJECTED', severity: 'danger' },

]

  constructor(
    private messageService: MessageService,
    private storageService: StorageService,
    private applicationService: ApplicationService,
    private interviewService:InterviewService,
    private jobService:JobsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userId = this.storageService.getUser().id;
    this.loadApplications();

    console.log(this.filteredApplications);
  }



  checkStatusforDropdown(status:string){
    if(status === 'Approved'){
      return this.statusOptionsIfApproved;
    }
    else if(status ==='PENDING'){
      return this.statusOptionsIfPending;
    }
    else if(status === 'INTERVIEW'){
      return this.statusOptionsIfInterview;
    }
    else return this.statusOptions;

  }

  getMatchingColor(score: number | null): string {
  if (score == null) {
    return '#cccccc'; // default gray if no score
  }
  if (score < 30) {
    return 'red';
  } else if (score >= 30 && score <= 60) {
    return 'orange'; // or '#FFA500' if you prefer
  } else {
    return 'green';
  }
}

 

  loadApplications() {
    this.loading = true;
    
    this.applicationService.getUserApplications(this.userId).subscribe({
      next: (data) => {
        this.applications = data as Application[];
        this.filteredApplications = [...this.applications];
        this.applyFilters();
        this.loading = false;
        
      },
      error: (error) => {
        console.error('Error loading applications:', error);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les candidatures'
        });
      }
    });
  }

  applyFilters() {
    // Filter by status
    this.filteredApplications = this.applications.filter(app => {
      if (this.selectedStatus === 'Tous') return true;
      return app.status === this.selectedStatus;
    });

    // Apply sorting
    this.applySorting();
  }

  applySorting() {
    const [field, order] = this.selectedSort.split('_');
    const isAsc = order === 'asc';

    this.filteredApplications.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (field) {
        case 'appliedDate':
          aValue = new Date(a.appliedDate).getTime();
          bValue = new Date(b.appliedDate).getTime();
          break;
        case 'username':
          aValue = a.user?.username || '';
          bValue = b.user?.username || '';
          break;
        case 'jobTitle':
          aValue = a.job?.title || '';
          bValue = b.job?.title || '';
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const result = aValue.localeCompare(bValue);
        return isAsc ? result : -result;
      }

      const result = aValue - bValue;
      return isAsc ? result : -result;
    });
  }

  onStatusFilter(status: string) {
    this.selectedStatus = status;
    this.applyFilters();
  }

  onSortChange(sortValue: string) {
    this.selectedSort = sortValue;
    this.applyFilters();
    //this.applySorting();
  }

  

  viewApplication(applicationId: number) {
    this.router.navigate(['/app/applicationUserDetails/', applicationId]);
  }

  editApplication(applicationId: number) {
    this.router.navigate(['/applications', applicationId, 'edit']);
  }

  scheduleInterview(applicationId: number) {
    /* this.router.navigate(['/applications', applicationId, 'interview']); */
    this.interviewService.getInterviewsByApplication(applicationId).subscribe({
      next:(data:any)=>{
        this.interviews = data;
        console.log("This applications interviews : ", this.interviews);
      },
      error:(error=>{
        console.error("An error occured fetching interviews : "+ error);
      })
    })
    
  }

  deleteApplication(applicationId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette candidature ?')) {
      this.applicationService.delelteApplication(applicationId).subscribe({
        next:()=>{
          this.applications = this.applications.filter(app => app.applicationId !== applicationId);
      this.applyFilters();
      this.messageService.add({
        severity: 'warn',
        summary: 'Suppression',
        detail: 'Candidature supprimée avec succès'
      });
        },
        error: (error) => {
          console.error('Error deleting application:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de supprimer la candidature'
          });
        }
      })
      
    }
  }




  downloadcv(vvFilePath: string) {
    if (vvFilePath) {
        const cvFileName = vvFilePath.split('/').pop() || vvFilePath;
        
        this.jobService.downloadCv(cvFileName);  // Pass just the filename
        this.messageService.add({
            severity: 'info',
            summary: 'Téléchargement',
            detail: `Téléchargement du CV: ${cvFileName}`
        });
    }
}

  getFilterButtonSeverity(status: string): "secondary" | "success" | "info" | "warn" | "help" | "danger" | "contrast" | undefined {
    switch (status) {
      case 'Tous': return 'secondary';
      case 'PENDING': return 'warn';
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'danger';
      case 'INTERVIEW': return 'info';
      default: return 'secondary';
    }
  }

  getStatusSeverity(status: string): "secondary" | "success" | "info" | "warning" | "help" | "danger" | "contrast" | undefined {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'danger';
      case 'INTERVIEW': return 'info';
      default: return 'secondary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PENDING': return 'En attente';
      case 'APPROVED': return 'Approuvée';
      case 'REJECTED': return 'Rejetée';
      case 'INTERVIEW': return 'Entretien';
      default: return status;
    }
  }

  formatDate(date: Date): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}