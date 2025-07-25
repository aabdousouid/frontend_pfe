import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { InterviewService } from '../../../../shared/services/interview.service';
import { Interview } from '../../../../shared/models/interview';
import { FieldsetModule } from 'primeng/fieldset';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { AvatarModule } from 'primeng/avatar';
import { UserInterviewDetailsComponent } from '../user-interview-details/user-interview-details.component';

@Component({
  selector: 'app-user-interviews',
  imports: [UserInterviewDetailsComponent,FieldsetModule,TagModule,ChipModule,AvatarModule,CommonModule,ButtonModule,DividerModule,ToastModule,DropdownModule,DialogModule,FormsModule],
  standalone:true,
  templateUrl: './user-interviews.component.html',
  styleUrl: './user-interviews.component.scss',
  providers: [MessageService]
})
export class UserInterviewsComponent implements OnInit{
  
  @Input() applicationId!: number;
  interviews! : Interview[];
  loading:boolean = false;
  legend:string='';
  visible: boolean = false;
  constructor(private messageService:MessageService,private interviewService:InterviewService){

  }
  
  ngOnInit(): void {
  this.loadInterviews();
  //console.log(this.interviews);
  }


  showDialog() {
        this.visible = true;
    }


  setLegend(interviewTest: string) {
    return this.legend = `Entretien ${interviewTest}`;
  }

  getInterviewStatusSeverity(status: string): string {
  switch (status) {
    case 'SCHEDULED': return 'warn';
    case 'COMPLETED': return 'success';
    case 'CANCELLED': return 'danger';
    case 'PENDING': return 'warning';
    default: return status;
  }
}

getStatusLabel(status: string): string {
    switch (status) {
      case 'SCHEDULED': return 'Entretien planifié';
      case 'CONFIRMED': return 'Entretien confirmé';
      default: return status;
    }
  }

  getStatusSeverity(status: string): "secondary" | "success" | "info" | "warn" | "help" | "danger" | "contrast" | undefined {
    switch (status) {
      case 'SCHEDULED': return 'warn';
      case 'CONFIRMED': return 'success';
      default: return 'secondary';
    }
  }


statusOptionsForDropdown = [
    { label: 'Entretien Planifié', value: 'SCHEDULED' },
    { label: 'Entretien Confirmée', value: 'CONFIRMED' }
  ];


  loadInterviews(){
    this.loading = true;
    this.interviewService.getInterviewsByApplication(this.applicationId).subscribe({
      next:(data=>{
        this.interviews = data as Interview [];
        console.log(this.interviews);
        this.loading = false;

      }),
      error:(error=>{
        console.error("error fetching interviews : ", error);
      })
    })
  }

  updateInterviewStatus(interviewId: number, newStatus: string) {
    const interview = this.interviews.find(interview => interview.interviewId === interviewId);
    if (interview) {
      interview.status = newStatus as any;
     
      
      // Here you would typically call your API to update the status
      // this.applicationService.updateStatus(applicationId, newStatus).subscribe(...)
      this.interviewService.updateInterviewStatus(interviewId,newStatus).subscribe({
        next: () => {
          console.log(`Application ${interviewId} status updated to ${newStatus}`);
          this.messageService.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Statut mis à jour avec succès'
      });
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
      
      
      
    }
  }
}
