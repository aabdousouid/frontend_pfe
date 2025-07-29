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

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type: 'text' | 'file' | 'suggestions';
  suggestions?: any[];
  context?: 'jobTypeSelection' | 'jobs'; // ✅ new context field
}

/* interface JobSuggestion {
  title: string;
  matchPercentage: number;
  requiredSkills: string[];
  experienceLevel: string;
  salaryRange: string;
  description: string;
} */

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
  quizAnswers: number[] = [];
  quizInProgress = false;
  quizCompleted = false;
  quizResult: any = null;
  selectedJob: any = null;
  jobs:any[]=[];
  selectedJobType: string = '';
  constructor(private messageService: MessageService,private chatbotService:ChatbotService,private jobsService:JobsService,private router:Router) {}

  ngOnInit() {
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
    content: "Please select your preferred job type:",
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
      this.messages.push({
        id: this.generateId(),
        content: file.name,
        sender: 'user',
        timestamp: new Date(),
        type: 'file'
      });

      
      // For now, mock job list — later, fetch from backend DB
      const mockJobs = [
       {
    id: 'JD005',
    title: 'DevOps Engineer',
    type: 'CDI',
    company: 'CloudOps',
    location: 'Sousse',
    description: 'Manage CI/CD pipelines and cloud infrastructure.',
    requirements: 'Strong knowledge of Docker, Jenkins, and Kubernetes.',
    skills: 'Docker Jenkins Kubernetes AWS Terraform Git'
  },
  
      ];

      const filteredJobs :any[] = this.jobs.filter(job => job.jobType === this.selectedJobType);

      this.chatbotService.matchJobs(parsedCV, filteredJobs).subscribe({
        next: (matchedJobs: any[]) => {
          console.log(matchedJobs);
          this.messages.push({
            id: this.generateId(),
            content: "Based on your CV, here are tailored job recommendations:",
            sender: 'bot',
            timestamp: new Date(),
            type: 'suggestions',
            context: 'jobs',
            suggestions: matchedJobs.map(job => ({
              title: job.job_title,
              matchPercentage: Math.round(job.overall_score * 100),
              requiredSkills: job.job_description.skills || [],
              experienceLevel: job.job_description.requirements || '',
              type: job.job_description.type,
              description: job.job_description.description,
              fullJob: job.job_description
            }))
          });

          this.cvUploaded = true;
          this.isAnalyzing = false;
          this.scrollToBottom();
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

  completeAnalysis() {
    this.isAnalyzing = false;
    this.cvUploaded = true;
    this.isTyping = true;

    // Simulate CV analysis (in real implementation, this would call your backend API)
    setTimeout(() => {
      this.cvAnalysis = this.simulateCVAnalysis();
      const suggestions = this.generateJobSuggestions(this.cvAnalysis);

      const analysisMessage: ChatMessage = {
        id: this.generateId(),
        content: "Great! I've analyzed your CV. Here are some job opportunities that match your profile:",
        sender: 'bot',
        timestamp: new Date(),
        type: 'suggestions',
        suggestions: suggestions
      };

      this.messages.push(analysisMessage);
      this.isTyping = false;
      this.scrollToBottom();

      this.messageService.add({
        severity: 'success',
        summary: 'CV Analysis Complete',
        detail: 'Your CV has been analyzed successfully!'
      });
    }, 2000);
  }

  simulateCVAnalysis(): CVAnalysis {
    // This would be replaced with actual CV parsing logic
    return {
      skills: ['JavaScript', 'Angular', 'TypeScript', 'Node.js', 'Python', 'SQL', 'AWS'],
      experience: ['Full Stack Development', 'Frontend Development', 'API Development', 'Database Design'],
      education: ['Computer Science Degree', 'Web Development Certification'],
      certifications: ['AWS Certified Developer', 'Angular Certification'],
      languages: ['English', 'French', 'Arabic'],
      experienceLevel: 'Mid-level',
      industries: ['Technology', 'Fintech', 'E-commerce']
    };
  }

  generateJobSuggestions(analysis: CVAnalysis): any[] {
    // This would be replaced with actual job matching algorithm
    return [
      {
        title: 'Senior Frontend Developer',
        matchPercentage: 92,
        requiredSkills: ['Angular', 'TypeScript', 'JavaScript', 'CSS'],
        experienceLevel: 'Mid to Senior Level',
        salaryRange: '$70,000 - $95,000',
        description: 'Join our team to build modern web applications using Angular and TypeScript. Perfect match for your frontend expertise!'
      },
      {
        title: 'Full Stack Developer',
        matchPercentage: 88,
        requiredSkills: ['JavaScript', 'Node.js', 'Angular', 'SQL'],
        experienceLevel: 'Mid Level',
        salaryRange: '$65,000 - $85,000',
        description: 'Develop end-to-end web solutions using your full stack skills. Great opportunity to work with modern technologies.'
      },
      {
        title: 'Cloud Developer',
        matchPercentage: 78,
        requiredSkills: ['AWS', 'Node.js', 'Python', 'JavaScript'],
        experienceLevel: 'Mid Level',
        salaryRange: '$75,000 - $100,000',
        description: 'Build scalable cloud solutions using AWS services. Your cloud certification makes you a strong candidate!'
      }
    ];
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
  const candidateName = 'Test User'; // You can prompt for this

  this.isTyping = true;
  this.chatbotService.startQuiz(job, candidateName).subscribe({
    next: (quizResponse) => {
      const questions = quizResponse.questions;
      this.messages.push({
        id: this.generateId(),
        content: "Let's test your knowledge! Please answer the following quiz:",
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      });

      // You now render these questions with radio buttons or dropdowns
      console.log('Quiz Questions:', questions);
      this.quizQuestions = quizResponse.questions;
      this.quizAnswers = new Array(this.quizQuestions.length).fill(-1);
      this.quizInProgress = true;
      this.selectedJob = job;

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
submitQuiz() {
  const candidateName = 'Test User';

  this.chatbotService.submitQuiz(this.quizAnswers, candidateName).subscribe({
    next: (result) => {
      this.quizResult = result;
      this.quizInProgress = false;
      this.quizCompleted = true;

      this.messages.push({
        id: this.generateId(),
        content: `Quiz completed! You scored ${result.score.toFixed(1)}%. Status: ${result.status}`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      });

      // If RETRY, allow retry option
      if (result.status === 'RETRY') {
        this.messages.push({
          id: this.generateId(),
          content: "You can retry the quiz to improve your score.",
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

  this.chatbotService.startQuiz(this.selectedJob, candidateName).subscribe({
    next: (quizResponse) => {
      this.quizQuestions = quizResponse.questions;
      this.quizAnswers = new Array(this.quizQuestions.length).fill(-1);
      this.quizInProgress = true;
      this.quizCompleted = false;
      this.quizResult = null;

      this.messages.push({
        id: this.generateId(),
        content: "Here’s a fresh retry of your quiz. Good luck!",
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
 
    this.router.navigate(['/app/jobapplication/', this.selectedJob.jobId]);
  
}

onSelectJobType(option: { label: string, value: string }) {
  this.selectedJobType = option.value;

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
