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
import { StorageService } from '../../../../shared/services/storage.service';
import { ApplicationService } from '../../../../shared/services/application.service';
import { Application } from '../../../../shared/models/application';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TimelineModule } from 'primeng/timeline';
import { PanelModule } from 'primeng/panel';
import { AccordionModule } from 'primeng/accordion';


@Component({
  selector: 'app-application-list',
  standalone: true,
  imports: [
    TableModule,
    AccordionModule,
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
  templateUrl: './applicationDetails.component.html', 
  styleUrl:'./applicationDetails.component.scss' ,
  providers: [MessageService]
})
export class ApplicationDetailsComponent implements OnInit {
  

   application: Application = new Application();
  loading: boolean = true;
  applicationId: number = 0;
  newComment: string = '';

  /* statusOptions = [
    { label: 'Pending', value: 'PENDING', severity: 'warning' },
    { label: 'Approved', value: 'APPROVED', severity: 'success' },
    { label: 'Rejected', value: 'REJECTED', severity: 'danger' },
    { label: 'Interview', value: 'INTERVIEW', severity: 'info' }
  ]; */
// Add this method to your ApplicationDetailsComponent class


// Update your statusOptions array to match the French labels
statusOptions = [
  { label: 'En attente', value: 'PENDING', severity: 'warning' },
  { label: 'Approuvé', value: 'APPROVED', severity: 'success' },
  { label: 'Rejeté', value: 'REJECTED', severity: 'danger' },
  { label: 'Entretien programmé', value: 'INTERVIEW', severity: 'info' },
  { label: 'Embauché', value: 'HIRED', severity: 'primary' }
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
    private route: ActivatedRoute,
    private router: Router,
    private applicationService: ApplicationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {

    this.applicationId = +this.route.snapshot.paramMap.get('id')!;
    this.loadApplicationDetails();
   
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

  }

  getStatusSeverity(status: string): string {
    const statusOption = this.statusOptions.find(option => option.value === status);
    return statusOption ? statusOption.severity : 'info';
  }

  goBack(): void {
    this.router.navigate([`/app/application/`]);
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

  // Add this method to your ApplicationDetailsComponent class

getStatusLabel(status: string): string {
  const statusOption = this.statusOptions.find(option => option.value === status);
  return statusOption ? statusOption.label : status;
}


}