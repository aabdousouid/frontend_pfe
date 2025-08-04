import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Application } from '../../../../shared/models/application';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { Button, ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { Interview } from '../../../../shared/models/interview';
import { FieldsetModule } from 'primeng/fieldset';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { InterviewUpadteComponent } from '../interview-upadte/interview-upadte.component';
import { InterviewService } from '../../../../shared/services/interview.service';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-interviews',
  imports: [CommonModule,CardModule,FormsModule,ButtonModule,DividerModule,TagModule,DropdownModule,ChipModule,FieldsetModule,TagModule,TooltipModule,DialogModule,ToastModule,MessagesModule/* InterviewUpadteComponent */],
  standalone: true,
  templateUrl: './interviews.component.html',
  styleUrl: './interviews.component.scss',
  providers: [MessageService] 
})
export class InterviewsComponent implements OnInit {


  @Input() application!: Application;
  @Input() interviewTypes: any[] = [];
  @Input() interviews: Interview[] = [];
   @Output() booleanValueChanged = new EventEmitter<boolean>();
   @Output() sendInterview = new EventEmitter<Interview>();
   @Output() interviewDeleted = new EventEmitter<number>();
  isActive = false;
  display: boolean = false;
  legend:string=''
  interview: Interview | undefined;
  constructor(private interviewService:InterviewService,private messageService:MessageService) {}

  ngOnInit(): void {
    // Initialization logic if needed
    console.log('Application from the interview component : ', this.application);
  }

 
  setLegend(interviewTest: string) {
    return this.legend = `Entretien ${interviewTest}`;
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
getInterviewTestSeverity(interviewTest: string): string {
  switch (interviewTest) {
    case 'RH': return 'info';
    case 'TECHNIQUE': return 'warn';
    default: return 'secondary';
  }
}

sendBooleanToParent(interview: Interview) {
    this.isActive = !this.isActive;
    this.interview = interview;
    this.booleanValueChanged.emit(this.isActive);
    this.sendInterview.emit(this.interview);
  }
open() {
        this.display = true;
     
      }

    close() {
        this.display = false;
    }

    deleteInterview(interviewId: number) {
  if (confirm('Êtes-vous sûr de vouloir supprimer L\'entretien ?')) {
    this.interviewService.deleteInterview(interviewId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Suppression',
          detail: 'L\'entretien supprimée avec succès'
        });

        this.interviewDeleted.emit(interviewId); // 👈 Notify parent
      },
      error: (error) => {
        console.error('Error deleting interview:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de supprimer L\'entretien'
        });
      }
    });
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
      case 'CANCELED' : return 'danger';
      case 'COMPLETED' : return 'info';
      default: return 'secondary';
    }
  }


statusOptionsForDropdownScheduled = [
    { label: 'Entretien Planifié', value: 'SCHEDULED' },
    { label: 'Entretien Confirmée', value: 'CONFIRMED' }
  ];


statusOptionsForDropdownConfirmed = [
    { label: 'Entretien Confirmée', value: 'CONFIRMED' },
    { label: 'Entretien Annulé', value: 'CANCELED' },
    { label: 'Entretien terminé', value: 'COMPLETED' }
  ];
updateInterviewStatus(interviewId: number, newStatus: string) {
  console.log('test')
    const interview = this.application.interviews?.find(interview => interview.interviewId === interviewId);
    console.log(interview);
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
