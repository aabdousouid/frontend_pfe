import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { PanelModule } from 'primeng/panel';
import { ProgressBarModule } from 'primeng/progressbar';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { Interview } from '../../../../shared/models/interview';
import { Application } from '../../../../shared/models/application';
import { InterviewService } from '../../../../shared/services/interview.service';
import { Job } from '../../../../shared/models/job';

interface InterviewData {
  candidateName: string;
  email: string;
  position: string;
  interviewType: string;
  date: string;
  time: string;
  duration: string;
  status: 'CONFIRMED' | 'PENDING' | 'COMPLETED' | 'CANCELLED';
  interviewer: string;
  interviewerRole: string;
  location: string;
  meetingLink: string;
  notes: string;
  requirements: string[];
}

@Component({
  selector: 'app-user-interview-details',
  standalone:true,
  imports: [ CommonModule,
    FormsModule,
    CardModule,
    TabViewModule,
    ButtonModule,
    TagModule,
    TextareaModule,
    DividerModule,
    AvatarModule,
    TooltipModule,
    BadgeModule,
    PanelModule,
    ProgressBarModule,
    ChipModule,
    MessageModule],
  templateUrl: './user-interview-details.component.html',
  styleUrl: './user-interview-details.component.scss',
  providers:[]
})
export class UserInterviewDetailsComponent {
  @Input() interview!: Interview;
  application!:Application ;
  feedbackText: string = '';
  user!:any;
  job?:Job;

  interviewData: InterviewData = {
    candidateName: "Abdelweheb Souid",
    email: "abdousould20@gmail.com",
    position: "PHP Developer",
    interviewType: "Technical Interview",
    date: "07/21/2025",
    time: "10:00 AM",
    duration: "60 minutes",
    status: "CONFIRMED",
    interviewer: "Sarah Johnson",
    interviewerRole: "Senior Developer",
    location: "Virtual Meeting",
    meetingLink: "https://meet.actia.com/interview-123",
    notes: "Technical assessment focused on PHP frameworks and database optimization.",
    requirements: [
      "Laptop with stable internet connection",
      "Code editor (VS Code recommended)",
      "Access to GitHub account"
    ]
  };


  constructor(private interviewService:InterviewService){

  }



  ngOnInit() {

    this.retieveApplication(this.interview.interviewId)
    
    // Initialize component
  }

  getInitials(name: string | undefined | ''): string {
    return name!
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
  }

  getStatusSeverity(status: string): "success" | "info" | "warning" | "danger" {
    switch (status) {
      case 'CONFIRMED': return 'success';
      case 'PENDING': return 'warning';
      case 'COMPLETED': return 'info';
      case 'CANCELLED': return 'danger';
      default: return 'info';
    }
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      // Show success message
      console.log('Link copied to clipboard');
    });
  }

  saveNotes() {
    // Implement save notes functionality
    console.log('Saving notes:', this.feedbackText);
  }

  retieveApplication(interviewId:number){
    this.interviewService.getApplicationByInterviewId(interviewId).subscribe({
      next:(data=>{
        this.application = data;
        this.user = data.user;
        this.job = data.job;
        
      }),
      error:(error=>{
        console.log("error fetching the application : ", error);
      })
    })
  }

  onCancelInterview() {
    // Optional: prevent cancel if already completed/cancelled
    if (this.interview.status === 'COMPLETED' || this.interview.status === 'CANCELLED') {
      alert(`Interview is already ${this.interview.status.toLowerCase()}.`);
      return;
    }

    if (!confirm("Confirmer l'annulation de cet entretien ?")) {
      return;
    }

    // Optional reason
    const reason = prompt('Raison (optionnelle) :') || undefined;

    // Preferred: use PATCH cancel endpoint if available
    this.interviewService.cancelInterview(this.interview.interviewId, reason).subscribe({
      next: (updated) => {
        this.interview.status = updated.status || 'CANCELLED';
        // You can also refresh application details if needed:
        // this.retieveApplication(this.interview.interviewId);
      },
      error: (_) => {
        // Fallback to old PUT endpoint if PATCH not available
        this.interviewService.cancelUsingPut(this.interview.interviewId).subscribe({
          next: () => (this.interview.status = 'CANCELLED'),
          error: (err) => console.error('Failed to cancel interview:', err),
        });
      },
    });
  }


}
