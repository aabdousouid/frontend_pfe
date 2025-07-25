import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { Interview } from '../../../../shared/models/interview';
import { FormsModule, NgModel } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { AccordionModule } from 'primeng/accordion';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';
import { InterviewService } from '../../../../shared/services/interview.service';

@Component({
  selector: 'app-interview-upadte',
  imports: [CommonModule,ButtonModule,CardModule,ToastModule,DialogModule,SelectModule,InputTextModule,RadioButtonModule,InputNumberModule,FormsModule,MessageModule,DropdownModule,TextareaModule,AccordionModule,CalendarModule],
  standalone:true,
  templateUrl: './interview-upadte.component.html',
  styleUrl: './interview-upadte.component.scss',
  providers: [MessageService]
})
export class InterviewUpadteComponent implements OnInit{
@Input() interview: Interview | undefined |null = null;
@Output() onClose = new EventEmitter<void>();
savingInterview: boolean = false;


  constructor(private messageService: MessageService,private interviewService:InterviewService) {}


  interviewTypes = [
    { label: 'Entretien physique', value: 'ONSITE' },
    { label: 'Entretien virtuel', value: 'REMOTE' },
    { label: 'Entretien téléphonique', value: 'ONPHONE' }
  ];

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
  ngOnInit(): void {
    console.log('Interview to update:', this.interview);
    if (this.interview && typeof this.interview.scheduledDate === 'string' && typeof this.interview.scheduledHour === 'string') {
    this.interview.scheduledDate = new Date(this.interview.scheduledDate);
    this.interview.scheduledHour = new Date(this.interview.scheduledHour);
}

  }
closeDialog() {
  this.onClose.emit();
}
saveInterviewDetails(){
  this.interviewService.updateInterview(this.interview!.interviewId,this.interview!).subscribe({
    next:(data=>{
      console.log("updated Interview : " + data);
      this.messageService.add({
          severity: 'info',
          summary: 'Modification de l\'entretien',
          detail: 'L\'entretien modfié avec succès'
        });
    }),
    error:(error=>{
      console.log("error updating this interview : " + error);
      this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de modifié L\'entretien'
        });
    })
  })
  
}
cancelInterviewDetails(){

}
}
