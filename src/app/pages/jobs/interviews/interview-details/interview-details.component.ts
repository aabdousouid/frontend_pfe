import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Application } from '../../../../shared/models/application';
import { Interview } from '../../../../shared/models/interview';
import { Button, ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { CalendarModule } from 'primeng/calendar';
import { InterviewService } from '../../../../shared/services/interview.service';
import { MessageService } from 'primeng/api';
import { AccordionModule } from 'primeng/accordion';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';


@Component({
  selector: 'app-interview-details',
  imports: [ CommonModule,
    AccordionModule,
    FormsModule,
    CardModule,
    ButtonModule,
    CalendarModule,
    InputTextModule,
    DropdownModule,
    TextareaModule,
    InputNumberModule,
    TagModule,
    ToastModule,
    MessageModule,
    DividerModule],
  standalone: true,
  templateUrl: './interview-details.component.html',
  styleUrl: './interview-details.component.scss',
  providers: [MessageService]
})
export class InterviewDetailsComponent implements OnInit {



blockedPanel: boolean = false;
@Input() application!: Application;
@Input() interviewTypes: any[] = [];
savingInterview: boolean = false;
@Output() interviewSaved = new EventEmitter<Interview>();
showForm: boolean = false;


  interviewTests = [
    { label: 'Entretien RH', value: 'RH' },
    { label: 'Entretien technique', value: 'TECHNIQUE' }
  ];

  interviewStatus = [
    { label: 'Entretien réalisé', value: 'COMPLETED' },
    { label: 'Entretien planifié', value: 'SCHEDULED' },
    { label: 'Entretien annulé', value: 'CANCELED'},
    { label: 'Entretien confirmé', value:'CONFIRMED'},
    
  ];
  constructor(private interviewService: InterviewService, private messageService: MessageService) {}
  ngOnInit(): void {
    if(this.application.interviews!.length == 2) {
      this.showForm=false;

    }else this.showForm=true;
    console.log("test : "+this.application.status);
  }


  getInterviewStatusSeverity(status: string): string {
  switch (status) {
    case 'SCHEDULED': return 'info';
    case 'COMPLETED': return 'success';
    case 'CANCELED': return 'Danger';
    case 'CONFIMED': return 'warn';
    default: return 'secondary';
  }
}

  initializeInterviewDetails(applicationId: number) {
    if (!this.interviewDetailsMap[applicationId]) {
      this.interviewDetailsMap[applicationId] = {
        applicationId: applicationId,
        scheduledDate: new Date(),
        scheduledHour: new Date(),
        interviewType: 'REMOTE',
        interviewTest: 'TECHNIQUE',
        location: '',
        interviewerName: '',
        interviewerEmail: '',
        notes: '',
        status: 'SCHEDULED',
        interviewId:0,
        meetingLink: '',
        duration:0
      };
    }
  }
  

   interviewDetailsMap: {[key: number]: Interview} = {};
  getInterviewDetails(applicationId: number): Interview {
    if (!this.interviewDetailsMap[applicationId]) {
      this.initializeInterviewDetails(applicationId);
    }
    return this.interviewDetailsMap[applicationId];
  }

   cancelInterviewDetails(applicationId: number) {
    this.initializeInterviewDetails(applicationId);
  }


  
isInterviewFormValid(applicationId: number): boolean {
    const details = this.getInterviewDetails(applicationId);
    return !!(
      details.scheduledDate &&
      details.scheduledHour &&
      details.interviewType &&
      details.interviewerName &&
      details.interviewerEmail &&
     
      (details.interviewType === 'REMOTE' ? details.meetingLink : 
       details.interviewType === 'ONSITE' ? details.location : true)
    );
  }
  
   saveInterviewDetails(applicationId: number) {
    if (!this.isInterviewFormValid(applicationId)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Veuillez remplir tous les champs obligatoires'
      });
      return;
    }
     this.savingInterview = true;
    const details = this.getInterviewDetails(applicationId);
    
    // Here you would call your API to save interview details
    // For now, we'll simulate an API call
    setTimeout(() => {
      console.log('Saving interview details:', details);
      
      // Simulate API call
      this.interviewService.saveInterview(applicationId,details).subscribe({
        next: (response) => {
          this.savingInterview = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Détails de l\'entretien sauvegardés avec succès'
          });
          this.interviewSaved.emit(response);
        },
        error: (error) => {
          this.savingInterview = false;
          console.error('Error saving interview details:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail:'Impossible de sauvegarder les détails de l\'entretien'
          });
        }
      });
    }, 1000);
  }


}
