import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
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
import { ApplicationService } from '../../../../shared/services/application.service';
import { Application } from '../../../../shared/models/application';
import { InputNumberModule } from 'primeng/inputnumber';
import { Interview } from '../../../../shared/models/interview';
import { InterviewService } from '../../../../shared/services/interview.service';
import { InterviewDetailsComponent } from "../../interviews/interview-details/interview-details.component";
import { InterviewsComponent } from '../../interviews/interviews/interviews.component';
import { InterviewUpadteComponent } from '../../interviews/interview-upadte/interview-upadte.component';


@Component({
  selector: 'app-application-list',
  standalone: true,
  imports: [
    InterviewUpadteComponent,
    CalendarModule,
    TableModule,
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
    ToggleSwitchModule,
    InputNumberModule,
    InterviewDetailsComponent,
    InterviewsComponent,
],
  templateUrl:'./applicationList.component.html' ,
  styleUrl: './applicationList.component.scss',
  providers: [MessageService]
})
export class ApplicationListComponent implements OnInit {
  applications: Application[] = [];
  filteredApplications: Application[] = [];
  selectedStatus: string = 'Tous';
  selectedSort: string = 'appliedDate_desc';
  loading: boolean = false;
  savingInterview: boolean = false;
  applicationInterviewsMap: { [key: number]: Interview[] } = {};

receivedBoolean: boolean = false;
receivedInterview: Interview | undefined | null = null;

  onBooleanChanged(value: boolean) {
    this.receivedBoolean = value;
    console.log('Received boolean from child:', value);
  }


  onInterviewSent(interview: Interview) {
    this.receivedInterview = interview;
    console.log('Received interview from child:', interview);
  }

  statusOptions = [
    { label: 'Tous', value: 'Tous' },
    { label: 'En attente', value: 'PENDING' },
    { label: 'Approuvées', value: 'APPROVED' },
    { label: 'Rejetées', value: 'REJECTED' },
    { label: 'Entretien', value: 'INTERVIEW' },
    {label:'Recruté',value:'HIRED'}
  ];

  statusOptionsForDropdown = [
    { label: 'En attente', value: 'PENDING' },
    { label: 'Approuvée', value: 'APPROVED' },
    { label: 'Rejetée', value: 'REJECTED' },
    { label: 'Entretien', value: 'INTERVIEW' },
    {label: 'Recruté', value: 'HIRED'}
  ];

  sortOptions = [
    { label: 'Date (plus récent)', value: 'appliedDate_desc' },
    { label: 'Date (plus ancien)', value: 'appliedDate_asc' },
    { label: 'Nom du candidat (A-Z)', value: 'username_asc' },
    { label: 'Nom du candidat (Z-A)', value: 'username_desc' },
    { label: 'Poste (A-Z)', value: 'jobTitle_asc' },
    { label: 'Statut', value: 'status_asc' }
  ];
  interviewTypes = [
    { label: 'Entretien physique', value: 'ONSITE' },
    { label: 'Entretien virtuel', value: 'REMOTE' },
    { label: 'Entretien téléphonique', value: 'ONPHONE' }
  ];

  constructor(
    private messageService: MessageService,
    private interviewService: InterviewService,
    private applicationService: ApplicationService,
    private router: Router
  ) {}

  ngOnInit() {
   
    this.loadApplications();
  }

 

onInterviewSaved(interview: Interview, application: Application) {
  if (!application.interviews) {
    application.interviews = [];
  }
  application.interviews.push(interview);
}

getInterviewStatusSeverity(status: string): string {
  switch (status) {
    case 'SCHEDULED': return 'info';
    case 'COMPLETED': return 'success';
    case 'CANCELLED': return 'danger';
    case 'PENDING': return 'warning';
    default: return 'secondary';
  }
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
    
    this.applicationService.getAllApplications().subscribe({
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
   downloadcv(applicationId:number){
    this.applicationService.downloadCv(applicationId).subscribe({
      next:(response=>{
        console.log('CV downloaded successfully');
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'CV téléchargé avec succès'
        })
        
      })
      ,
      error:(error=>{
        console.error('Error downloading CV:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de télécharger le CV'
        });
      
    })
  })
    
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

  /* updateApplicationStatus(applicationId: number, newStatus: string) {
    const application = this.applications.find(app => app.applicationId === applicationId);
    if (application) {
      application.status = newStatus as any;
      application.lastUpdated = new Date();
      
      
      this.applicationService.updateStatus(applicationId,newStatus).subscribe({
        next: () => {
          console.log(`Application ${applicationId} status updated to ${newStatus}`);
        },
        error: (error) => {
          console.error('Error updating application status:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de mettre à jour le statut de la candidature'
          });
        }
      })
      
      this.applyFilters();
      this.messageService.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Statut mis à jour avec succès'
      });
    }
  } */

updateApplicationStatus(applicationId: number, newStatus: any) {
  const app = this.filteredApplications.find(a => a.applicationId === applicationId);
  if (!app) return;

/*   const validStatuses = this.getAvailableStatuses(app.status, app.interviews?.length || 0);
  const isAllowed = validStatuses.some(s => s.value === newStatus);

  if (!isAllowed) {
    this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de mettre à jour le statut de la candidature'
          });
    return;
  }
 */
  this.applicationService.updateStatus(applicationId, newStatus).subscribe({
    next: () => {
      app.status = newStatus;
      this.messageService.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Statut mis à jour avec succès'
      });
    },
    error: err => {
     this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de mettre à jour le statut de la candidature'
          });
    }
  });
}




  viewApplication(applicationId: number) {
    this.router.navigate(['/app/applications/', applicationId]);
  }

  editApplication(applicationId: number) {
    this.router.navigate(['/applications', applicationId, 'edit']);
  }

  scheduleInterview(applicationId: number) {
    this.router.navigate(['/applications', applicationId, 'interview']);
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

  onInterviewDeleted(interviewId: number, application: Application) {
  if (application.interviews) {
    application.interviews = application.interviews.filter(i => i.interviewId !== interviewId);
  }
}



  getFilterButtonSeverity(status: string): "secondary" | "success" | "info" | "warn" | "help" | "danger" | "contrast" | undefined {
    switch (status) {
      case 'Tous': return 'secondary';
      case 'PENDING': return 'warn';
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'danger';
      case 'INTERVIEW': return 'info';
      case 'HIRED':return 'success';
      default: return 'secondary';
    }
  }

  getStatusSeverity(status: string): "secondary" | "success" | "info" | "warning" | "help" | "danger" | "contrast" | undefined {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'danger';
      case 'INTERVIEW': return 'info';
      case 'HIRED':return 'success';
      default: return 'secondary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PENDING': return 'En attente';
      case 'APPROVED': return 'Approuvée';
      case 'REJECTED': return 'Rejetée';
      case 'INTERVIEW': return 'Entretien';
      case 'HIRED':return 'Recruté';
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
 
  getAvailableStatuses(currentStatus: string, interviewsCount: number): { label: string; value: string }[] {
  switch (currentStatus) {
    case 'PENDING':
      return [
        { label: 'Approuvée', value: 'APPROVED' },
        { label: 'Rejetée', value: 'REJECTED' }
      ];
    case 'APPROVED':
      return [
        { label: 'Entretien', value: 'INTERVIEW' },
        { label: 'Rejetée', value: 'REJECTED' }
      ];
    case 'INTERVIEW':
      return interviewsCount >= 2
        ? [
            { label: 'Rejetée', value: 'REJECTED' },
            { label: 'Embauchée', value: 'HIRED' }
          ]
        : [{ label: 'Rejetée', value: 'REJECTED' }];
    default:
      return []; // REJECTED, HIRED have no transitions
  }
}

   
}