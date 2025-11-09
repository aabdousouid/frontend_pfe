import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ToastModule } from 'primeng/toast';
import { ChatbotService } from '../../../shared/services/chatbot.service';
import { RadioButtonModule } from 'primeng/radiobutton';
import { JobsService } from '../../../shared/services/jobs.service';
import { Route, Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { Job } from '../../../shared/models/job';
import { StorageService } from '../../../shared/services/storage.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';


interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type: 'text' | 'file' | 'suggestions';
  suggestions?: any[];
  context?: 'jobTypeSelection' | 'jobs'; // ✅ new context field
}

type JobSuggestionVM = {
  title: string;
  matchPercentage: number;
  description: string;
  experienceLevel?: string;
  type: string;
  requiredSkills: string[];
  match_explanation?: string;
  fullJob?: any;
};

interface CVAnalysis {
  skills: string[];
  experience: string[];
  education: string[];
  certifications: string[];
  languages: string[];
  experienceLevel: string;
  industries: string[];
}


@Component({
  selector: 'app-chatbot',
  imports: [ CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    FileUploadModule,
    ScrollPanelModule,
    AvatarModule,
    BadgeModule,
    ChipModule,
    ProgressBarModule,
    ScrollPanelModule,
    RadioButtonModule,
    DropdownModule,
    ProgressSpinnerModule,
    ToastModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss',
  standalone:true,
  providers: [MessageService],
})
export class ChatbotComponent implements OnInit {
 @ViewChild('chatContainer') chatContainer!: ElementRef;

  messages: any[] = [];
  currentMessage = '';
  isTyping = false;
  isOnline = true;
  cvUploaded = false;
  isAnalyzing = false;
  analysisProgress = 0;
  cvAnalysis: CVAnalysis | null = null;
  quizQuestions: any[] = [];
  quizAnswers: any[] = [];
  quizInProgress = false;
  quizCompleted = false;
  quizResult: any = null;
  selectedJob: any = null;
  showDiv:boolean=true;
  jobs:any[]=[];
  selectedJobType: string = '';
  filteredJobs!:any[];
  parsedCv?:any;
  isApplying: boolean = false; // <-- add this to your component
  constructor(private messageService: MessageService,private chatbotService:ChatbotService,private jobsService:JobsService,private router:Router,private storageService:StorageService) {}

  ngOnInit() {
 
    /* console.log( this.storageService.getUser().id+'    '+this.storageService.getUser().username); */
    this.initializeChat();

    this.jobsService.getAllJobs().subscribe({
      next:(data=>{
        this.jobs = data;
      })
    })
  }



  jobTypeOptions = [
  { label: 'CDI (Poste Permanente)', value: 'CDI' },
  { label: 'PFE (Projet de fin d\'étude)', value: 'STAGE_PFE' },
  { label: 'Stage d\'Été', value: 'STAGE_ETE' },
  { label: 'Alternance', value: 'ALTERNANCE' }
];



  initializeChat() {
  const welcomeMessage: ChatMessage = {
    id: this.generateId(),
    content: "Bonjour ! Je suis votre assistant de recrutement ACTIA.\n Avant de commencer, pouvez-vous me dire quel type d'opportunité vous recherchez?",
    sender: 'bot',
    timestamp: new Date(),
    type: 'text'
  };

  const jobTypeSelectionMessage: ChatMessage = {
    id: this.generateId(),
    content: "Veuillez sélectionner votre type de poste préféré : ",
    sender: 'bot',
    timestamp: new Date(),
    type: 'suggestions',
    context: 'jobTypeSelection', // ✅ avoids triggering job cards
    suggestions: this.jobTypeOptions.map(opt => ({
      label: opt.label,
      value: opt.value
    }))
  };

  this.messages.push(welcomeMessage);
  this.messages.push(jobTypeSelectionMessage);
}

  onFileSelect(event: any) {
    const file = event.files[0];
    if (file) {
      this.handleCVUpload(file);
    }
  }

  onFileRemove(event: any) {
    this.cvUploaded = false;
    this.cvAnalysis = null;
  }

  handleCVUpload(file: File) {
  this.isAnalyzing = true;
  this.analysisProgress = 0;
  this.scrollToBottom();

  this.chatbotService.parseCV(file).subscribe({
    next: (parsedCV) => {
      // Add file to messages
      this.parsedCv = parsedCV;
      this.messages.push({
        id: this.generateId(),
        content: file.name,
        sender: 'user',
        timestamp: new Date(),
        type: 'file'
      });

const jobsForMatching = (this.filteredJobs && this.filteredJobs.length > 0)
  ? this.filteredJobs
  : this.jobs;

// (Optional) if the CV parser failed earlier, stop here with a toast
if (parsedCV && parsedCV.error) {
  this.isAnalyzing = false;
  this.messageService.add({
    severity: 'error',
    summary: 'CV Parsing Error',
    detail: 'Le CV n’a pas pu être analysé. Réessayez avec un PDF/DOC lisible.'
  });
  return;
}

this.chatbotService.matchJobs(parsedCV, jobsForMatching).subscribe({
  next: (matchedJobs: any[]) => {
    // Map backend payload to UI schema expected by the template
    const suggestions: JobSuggestionVM[] = (matchedJobs || []).map(m => ({
      title: m.job_title ?? m.title ?? 'Untitled job',
      matchPercentage: Math.round(m.similarity_score ?? m.matchPercentage ?? 0),
      description: m.description ?? '',
      experienceLevel: m.requirements ?? m.experience ?? '',
      type: m.job_type ?? m.type ?? '',
      requiredSkills: m.matching_skills ?? m.requiredSkills ?? [],
      match_explanation: m.match_explanation ?? '',
      fullJob: m, // keep raw object for quiz/apply flows
    }));

    this.messages.push({
      id: this.generateId(),
      content: "Super ! J'ai analysé votre CV. Voici quelques offres d'emploi qui correspondent à votre profil : ",
      sender: 'bot',
      timestamp: new Date(),
      type: 'suggestions',
      context: 'jobs',          // <<< IMPORTANT for *ngIf in template
      suggestions               // <<< array shaped for the template
    });

    this.cvUploaded = true;
    this.isAnalyzing = false;
    this.scrollToBottom();
    this.messageService.add({
      severity: 'success',
      summary: 'Analyse du CV terminée',
      detail: 'Votre CV a été analysé avec succès !'
    });
  },
  error: (err) => {
    this.isAnalyzing = false;
    this.messageService.add({ severity: 'error', summary: 'Matching Error', detail: err.message });
  }
});
    },
    error: (err) => {
      this.isAnalyzing = false;
      this.messageService.add({ severity: 'error', summary: 'CV Parsing Error', detail: err.message });
    }
  });
}

  

  sendMessage() {
    if (!this.currentMessage.trim() || !this.cvUploaded) return;

    const userMessage: ChatMessage = {
      id: this.generateId(),
      content: this.currentMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    this.messages.push(userMessage);
    const question = this.currentMessage;
    this.currentMessage = '';
    this.isTyping = true;
    this.scrollToBottom();

    // Simulate bot response
    setTimeout(() => {
      const botResponse = this.generateBotResponse(question);
      const botMessage: ChatMessage = {
        id: this.generateId(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };

      this.messages.push(botMessage);
      this.isTyping = false;
      this.scrollToBottom();
    }, 1500);
  }

  generateBotResponse(question: string): string {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('salary') || lowerQuestion.includes('pay')) {
      return "Based on your skills and experience level, you can expect salaries ranging from $65,000 to $100,000 depending on the role and company. Your AWS certification and Angular expertise are particularly valuable in the current market.";
    }
    
    if (lowerQuestion.includes('skill') || lowerQuestion.includes('improve')) {
      return "To strengthen your profile, consider adding React to complement your Angular skills, learning Docker for containerization, or getting familiar with cloud platforms like Azure or GCP to expand beyond AWS.";
    }
    
    if (lowerQuestion.includes('remote') || lowerQuestion.includes('location')) {
      return "Many of the suggested positions offer remote work options. Your technical skill set is well-suited for remote development roles, especially in the current market where remote work is widely accepted.";
    }
    
    if (lowerQuestion.includes('interview') || lowerQuestion.includes('prepare')) {
      return "For interview preparation, focus on: 1) Angular/TypeScript technical questions, 2) System design scenarios, 3) Your AWS experience, 4) Problem-solving with JavaScript. I recommend practicing coding challenges and reviewing your project experiences.";
    }
    
    return "That's a great question! Based on your CV analysis, I can provide more specific guidance about your career path. Feel free to ask about salary expectations, skill development, interview preparation, or specific job requirements.";
  }

  trackByMessageId(index: number, message: ChatMessage): string {
    return message.id;
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.chatContainer) {
        const scrollPanel = this.chatContainer.nativeElement.querySelector('.p-scrollpanel-content');
        if (scrollPanel) {
          scrollPanel.scrollTop = scrollPanel.scrollHeight;
        }
      }
    }, 100);
  }

  generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }


  onSelectJob(job: any) {

  const candidateName = this.storageService.getUser().username; // You can prompt for this

  this.isTyping = true;
  this.chatbotService.startQuiz(this.parsedCv,job, candidateName).subscribe({
    next: (quizResponse) => {
      const questions = quizResponse.questions;
      this.messages.push({
        id: this.generateId(),
        content: "Testez vos connaissances ! Répondez au quiz suivant : ",
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      });

      // You now render these questions with radio buttons or dropdowns
      console.log('Quiz Questions:', questions);
      this.quizQuestions = quizResponse.questions;
      this.quizAnswers = new Array(this.quizQuestions.length).fill(-1);
      //this.quizAnswers = new Array(this.quizQuestions.length).fill('');

      this.quizInProgress = true;
      this.selectedJob = job;
      console.log('le offre selectionner : ',this.selectedJob);
      this.scrollToBottom();
      this.isTyping = false;

      // Store `questions` for use in submitQuiz()
    },
    error: (err) => {
      this.messageService.add({ severity: 'error', summary: 'Quiz Generation Error', detail: err.message });
      this.isTyping = false;
    }
  });
}

getCurrentUserId(): number {
  
  return this.storageService.getUser().id;
}

submitQuiz() {
  const candidateName = 'Test User';
  this.chatbotService.submitQuiz(this.quizAnswers, candidateName).subscribe({
    next: (result) => {
      this.quizResult = result;
      this.quizInProgress = false;
      this.quizCompleted = true;

      this.messages.push({
        id: this.generateId(),
        content: `Quiz terminé ! Vous avez obtenu ${result.score.toFixed(1)}%. Status: ${result.status}`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      });

      if (result.status === 'PASS') {
        const userId = this.getCurrentUserId();
        const jobId = this.selectedJob.fullJob.job_id;
        const quizScore = result.score;
        const matchScore = this.selectedJob.matchPercentage;

        if (quizScore == null || matchScore == null) {
          console.error('Missing quizScore or matchScore');
          return;
        }

        // Start loader
        this.isApplying = true;

        const formData = new FormData();
        formData.append('quizScore', quizScore.toString());
        formData.append('matchingScore', matchScore.toString());
        this.chatbotService.applyToJobViaQuiz(jobId, userId, formData).subscribe({
          next: res => {
            this.showDiv = true;
            this.isApplying = false; // stop loader
            this.messageService.add({
              severity: 'success',
              summary: 'Candidature envoyée',
              detail: 'Votre candidature a été soumise avec succès !'
            });
          },
          error: err => {
            this.isApplying = false;
            this.showDiv = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de l\'envoi de la candidature.'
            });
          }
        });

      } else if (result.status === 'RETRY') {
        this.messages.push({
          id: this.generateId(),
          content: "Vous pouvez retenter le quiz pour améliorer votre score.",
          sender: 'bot',
          timestamp: new Date(),
          type: 'text'
        });
      }

      this.scrollToBottom();
    },
    error: (err) => {
      this.messageService.add({ severity: 'error', summary: 'Quiz Submission Error', detail: err.message });
    }
  });
}



categoryScoreKeys(): string[] {
  return this.quizResult ? Object.keys(this.quizResult.category_scores) : [];
}

retryQuiz() {
  if (!this.selectedJob) return;

  const candidateName = 'Test User'; // Or use a real user name if available
  this.isTyping = true;

  this.chatbotService.startQuiz(this.parsedCv,this.selectedJob, candidateName).subscribe({
    next: (quizResponse) => {
      this.quizQuestions = quizResponse.questions;
      this.quizAnswers = new Array(this.quizQuestions.length).fill(-1);
      //this.quizAnswers = new Array(this.quizQuestions.length).fill('');

      this.quizInProgress = true;
      this.quizCompleted = false;
      this.quizResult = null;

      this.messages.push({
        id: this.generateId(),
        content: "Voici une nouvelle tentative pour votre quiz. Bonne chance ! : ",
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      });

      this.scrollToBottom();
      this.isTyping = false;
    },
    error: (err) => {
      this.messageService.add({ severity: 'error', summary: 'Retry Error', detail: err.message });
      this.isTyping = false;
    }
  });
}

  apply() {
      console.log('Applying for job:', this.selectedJob.fullJob.job_id);
      this.router.navigate(['/app/jobapplication', this.selectedJob.fullJob.job_id]);
    
  }

onSelectJobType(option: { label: string, value: string }) {
  this.selectedJobType = option.value;
   this.filteredJobs = this.jobs.filter(job => job.jobType === option.value);
   console.log(this.filteredJobs);
  // Push user response
  this.messages.push({
    id: this.generateId(),
    content: `Je recherche : ${option.label}`,
    sender: 'user',
    timestamp: new Date(),
    type: 'text'
  });

  // Bot acknowledgment
  this.messages.push({
    id: this.generateId(),
    content: `Excellent ! Vous recherchez un ${option.label}. Veuillez maintenant télécharger votre CV afin que je puisse analyser votre profil et vous proposer les meilleures opportunités correspondant à vos compétences.`,
    sender: 'bot',
    timestamp: new Date(),
    type: 'text'
  });

  this.scrollToBottom();
}



}