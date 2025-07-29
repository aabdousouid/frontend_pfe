import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ComplaintService } from '../../../shared/services/complaint.service';
import { Router } from '@angular/router';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

export interface Complaint {
  complaintId: number;
  title: string;
  description: string;
  complaintStatus: ComplaintStatus;
  complaintType: ComplaintType;
  user: {
    id: number;
    email: string;
    username: string;
  };
  createdDate?: Date;
}

export enum ComplaintStatus {
  RESOLVED = 'RESOLVED',
  ABANDONED = 'ABANDONED',
  OPEN = 'OPEN',
  REJECTED = 'REJECTED'
}

export enum ComplaintType {
  TECHNICAL_ISSUE = 'TECHNICAL_ISSUE',
  PROFILE_ISSUE = 'PROFILE_ISSUE',
  OTHER = 'OTHER'
}


@Component({
  selector: 'app-complaints-list-admin',
  imports: [CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    DropdownModule,
    InputTextModule,
    DialogModule,
    TextareaModule,
    FormsModule,
    ConfirmDialogModule,
    BadgeModule,
    CardModule,
    TooltipModule,
    ChipModule,
    ProgressBarModule,
    IconFieldModule,
    InputIconModule,
    ToastModule],
  templateUrl: './complaints-list-admin.component.html',
  styleUrl: './complaints-list-admin.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class ComplaintsListAdminComponent implements OnInit{
 complaints: Complaint[] = [];
   filteredComplaints: Complaint[] = [];
   selectedStatus: string = 'Tous';
   selectedSort: string = 'appliedDate_desc';
   loading: boolean = false;
  selectedComplaint: Complaint | null = null;
  viewDialogVisible = false;
  searchQuery: string = '';
   statusOptions = [
  { label: 'Tous', value: 'Tous' },
  { label: 'Résolu', value: 'RESOLVED' },
  { label: 'Ouvert', value: 'OPEN' },
  { label: 'Abandonné', value: 'ABANDONED' },
  { label: 'Rejeté', value: 'REJECTED' }
];

statusOptionsForDropdown = [
  { label: 'Résolu', value: 'RESOLVED' },
  { label: 'Ouvert', value: 'OPEN' },
  { label: 'Abandonné', value: 'ABANDONED' },
  { label: 'Rejeté', value: 'REJECTED' }
];
 
   sortOptions = [
  { label: 'Date (plus récent)', value: 'date_desc' },
  { label: 'Date (plus ancien)', value: 'date_asc' },
  { label: 'Statut', value: 'status' },
  { label: 'Titre', value: 'title' }
];


 
   constructor(
     private messageService: MessageService,
     private complaintService: ComplaintService,
     private router: Router
   ) {}
 
   ngOnInit() {
    
     this.loadApplications();
   }
 
  
 
  onSearchChange() {
    this.applyFilters();
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
 
 
 viewComplaint(complaint: Complaint) {
    this.selectedComplaint = complaint;
    this.viewDialogVisible = true;
  }
  getTypeLabel(type: ComplaintType): string {
    const labels = {
      [ComplaintType.TECHNICAL_ISSUE]: 'Problème technique',
      [ComplaintType.PROFILE_ISSUE]: 'Problème de profil',
      [ComplaintType.OTHER]: 'Autre'
    };
    return labels[type];
  }

  getTypeSeverity(type: ComplaintType): string {
    const severities = {
      [ComplaintType.TECHNICAL_ISSUE]: 'danger',
      [ComplaintType.PROFILE_ISSUE]: 'info',
      [ComplaintType.OTHER]: 'secondary'
    };
    return severities[type];
  }
 
   loadApplications() {
     this.loading = true;
     
     this.complaintService.getAllComplaints().subscribe({
       next: (data) => {
         this.complaints = data as Complaint[];
         this.filteredComplaints = [...this.complaints];
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
  this.filteredComplaints = this.complaints.filter(c => {
    const matchesSearch = !this.searchQuery || 
        c.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        c.complaintStatus.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        c.user.username.toLowerCase().includes(this.searchQuery.toLowerCase()) 
        
    return (this.selectedStatus === 'Tous' || c.complaintStatus === this.selectedStatus) && matchesSearch;
  });

  this.applySorting();
}
 
   applySorting() {
     const [field, order] = this.selectedSort.split('_');
     const isAsc = order === 'asc';
 
     this.filteredComplaints.sort((a, b) => {
       let aValue: any;
       let bValue: any;
 
       switch (field) {
         case 'Date':
           aValue = new Date(a.createdDate!).getTime();
           bValue = new Date(b.createdDate!).getTime();
           break;
         case 'username':
           aValue = a.user?.username || '';
           bValue = b.user?.username || '';
           break;
         case 'Title':
           aValue = a.title || '';
           bValue = b.title || '';
           break;
         case 'status':
           aValue = a.complaintStatus;
           bValue = b.complaintStatus;
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
   clearFilters() {
    this.searchQuery = '';
    this.selectedSort = 'appliedDate_desc';
    this.selectedStatus = 'Tous';
    this.applyFilters();
  }
   
 
 updateApplicationStatus(complaintId: number, newStatus: any) {
   const app = this.filteredComplaints.find(a => a.complaintId === complaintId);
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
   this.complaintService.updateStatus(complaintId, newStatus).subscribe({
     next: () => {
       app.complaintStatus = newStatus;
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
 
   deleteComplaint(complaintId: number) {
     if (confirm('Êtes-vous sûr de vouloir supprimer cette candidature ?')) {
       this.complaintService.delelteComplaint(complaintId).subscribe({
         next:()=>{
           this.complaints = this.complaints.filter(app => app.complaintId !== complaintId);
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
 
   
 
 
 
   getFilterButtonSeverity(status: string): "secondary" | "success" | "info" | "warn" | "danger" {
  switch (status) {
    case 'Tous': return 'secondary';
    case 'RESOLVED': return 'success';
    case 'OPEN': return 'info';
    case 'ABANDONED': return 'warn';
    case 'REJECTED': return 'danger';
    default: return 'secondary';
  }
}

getStatusSeverity(status: string): "secondary" | "success" | "info" | "warn" | "danger" {
  switch (status) {
    case 'RESOLVED': return 'success';
    case 'OPEN': return 'info';
    case 'ABANDONED': return 'warn';
    case 'REJECTED': return 'danger';
    default: return 'secondary';
  }
}
 
   getStatusLabel(status: string): string {
  switch (status) {
    case 'RESOLVED': return 'Résolu';
    case 'OPEN': return 'Ouvert';
    case 'ABANDONED': return 'Abandonné';
    case 'REJECTED': return 'Rejeté';
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
