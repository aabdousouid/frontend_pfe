import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';
import { ToastModule } from 'primeng/toast';
import { Application } from '../../../../shared/models/application';
import { ApplicationService } from '../../../../shared/services/application.service';
import { QuizResult } from '../../../../shared/models/quiz-result';

interface TimelineStep {
  number: number;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
  icon: string;
  date?: Date;
}

@Component({
  selector: 'app-application-details-user',
  imports: [
    AccordionModule,
    TimelineModule,
    CommonModule,
    CardModule,
    ButtonModule,
    TagModule,
    BadgeModule,
    ToastModule,
    ChipModule,
    DividerModule,
    MessageModule,
    ProgressSpinnerModule,
    BreadcrumbModule
  ],
  templateUrl: './application-details-user.component.html',
  styleUrl: './application-details-user.component.scss',
  providers:[MessageService],
  encapsulation: ViewEncapsulation.Emulated,
})
export class ApplicationDetailsUserComponent {

  application: Application = new Application();
  loading: boolean = true;
  applicationId: number = 0;
  timelineSteps: TimelineStep[] = [];
  QuizResult:QuizResult = new QuizResult();

  statusOptions = [
    { label: 'En attente', value: 'PENDING', severity: 'warning' },
    { label: 'Approuvé', value: 'APPROVED', severity: 'success' },
    { label: 'Rejeté', value: 'REJECTED', severity: 'danger' },
    { label: 'Entretien programmé', value: 'INTERVIEW', severity: 'info' },
    { label: 'Embauché', value: 'HIRED', severity: 'primary' }
  ];

  

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private applicationService: ApplicationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.applicationId = +this.route.snapshot.paramMap.get('id')!;
    this.loadApplicationDetails();    
    this.loadQuizDetails();
    console.log('Quiz loaded:', QuizResult);


  }

  loadApplicationDetails(): void {
    this.loading = true;
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

        // Build timeline after loading application data
        this.buildTimeline();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading application details:', error);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les détails de la candidature'
        });
      }
    });
  }

  loadQuizDetails():void{
    this.applicationService.findQuizByApplication(this.applicationId).subscribe({
      next:((data:any)=>{
        this.QuizResult = data;
        
      }),
      error:(err=>{
        this.messageService.add({
          severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de charger les détails du quiz'
        })
      })
      
    })
  }



  buildTimeline(): void {
    const currentStatus = this.application.status;
    
    this.timelineSteps = [
      {
        number: 1,
        title: 'Candidature soumise',
        description: 'Votre candidature a été reçue et est en cours d\'examen',
        completed: true,
        current: false,
        icon: 'pi pi-check',
        date: this.application.appliedDate
      },
      {
        number: 2,
        title: 'Examen en cours',
        description: 'Notre équipe RH examine votre profil et vos compétences',
        completed: currentStatus !== 'PENDING',
        current: currentStatus === 'PENDING',
        icon: 'pi pi-eye'
      },
      {
        number: 3,
        title: 'Décision prise',
        description: this.getDecisionDescription(currentStatus),
        completed: ['APPROVED', 'INTERVIEW', 'HIRED'].includes(currentStatus),
        current: currentStatus === 'APPROVED',
        icon: 'pi pi-check-circle'
      },
      {
        number: 4,
        title: 'Entretien',
        description: 'Entretien avec l\'équipe technique et RH',
        completed: ['HIRED'].includes(currentStatus),
        current: currentStatus === 'INTERVIEW',
        icon: 'pi pi-users'
      },
      {
        number: 5,
        title: 'Décision finale',
        description: this.getFinalDecisionDescription(currentStatus),
        completed: currentStatus === 'HIRED',
        current: false,
        icon: 'pi pi-trophy'
      }
    ];

    // Handle rejected status
    if (currentStatus === 'REJECTED') {
      this.timelineSteps = this.timelineSteps.map((step, index) => {
        if (index <= 2) {
          step.completed = true;
          step.current = false;
        } else {
          step.completed = false;
          step.current = false;
          step.description = 'Votre candidature n\'a pas été retenue pour cette fois';
        }
        return step;
      });
      
      // Mark the rejection step as current
      this.timelineSteps[2].current = true;
      this.timelineSteps[2].icon = 'pi pi-times-circle';
      this.timelineSteps[2].title = 'Candidature non retenue';
    }
  }

  getDecisionDescription(status: string): string {
    switch (status) {
      case 'APPROVED':
        return 'Félicitations ! Votre profil a été retenu';
      case 'REJECTED':
        return 'Votre candidature n\'a pas été retenue cette fois';
      case 'INTERVIEW':
        return 'Vous êtes convoqué(e) pour un entretien';
      case 'HIRED':
        return 'Vous avez été sélectionné(e) pour le poste';
      default:
        return 'En attente de décision';
    }
  }

  getFinalDecisionDescription(status: string): string {
    switch (status) {
      case 'HIRED':
        return 'Félicitations ! Vous avez été embauché(e)';
      case 'REJECTED':
        return 'Votre candidature n\'a pas été retenue';
      default:
        return 'En attente de la décision finale';
    }
  }

  downloadCV(): void {
    if (this.application.user?.id) {
      this.applicationService.downloadCv(this.application.user.id).subscribe({
        next: (response: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'CV téléchargé avec succès'
          });
        },
        error: (error) => {
          console.error('Error downloading CV:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de télécharger le CV'
          });
        }
      });
    }
  }

  getStatusSeverity(status: string): string {
    const statusOption = this.statusOptions.find(option => option.value === status);
    return statusOption ? statusOption.severity : 'info';
  }

  getStatusLabel(status: string): string {
    const statusOption = this.statusOptions.find(option => option.value === status);
    return statusOption ? statusOption.label : status;
  }

  goBack(): void {
    this.router.navigate(['/app/dashboard']);
  }

  getCommentsTimeline(): any[] {
    if (!this.application.adminComments || this.application.adminComments.length === 0) {
      return [];
    }
    
    return this.application.adminComments.map((comment, index) => ({
      text: comment,
      date: new Date(), // You might want to store actual dates with comments
      author: 'Équipe RH'
    }));
  }
}