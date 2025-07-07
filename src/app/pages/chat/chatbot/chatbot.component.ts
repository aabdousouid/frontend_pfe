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

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type: 'text' | 'file' | 'suggestions';
  suggestions?: any[];
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

  constructor(private messageService: MessageService,private chatbotService:ChatbotService) {}

  ngOnInit() {
    this.initializeChat();
  }

  initializeChat() {
    const welcomeMessage: ChatMessage = {
      id: this.generateId(),
      content: "Hello! I'm your CV Career Assistant. Please upload your CV and I'll analyze it to suggest the best job opportunities for you based on your skills and experience.",
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    };
    this.messages.push(welcomeMessage);
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
    // Add file upload message
    const fileMessage: ChatMessage = {
      id: this.generateId(),
      content: file.name,
      sender: 'user',
      timestamp: new Date(),
      type: 'file'
    };
    this.messages.push(fileMessage);

    // Start analysis
    this.isAnalyzing = true;
    this.analysisProgress = 0;
    this.scrollToBottom();

    // Simulate CV analysis progress
    this.chatbotService.uploadCV(file).subscribe({
    next: (res) => {
      const cvText = res.text;

      this.chatbotService.recommendJobs(cvText).subscribe({
        next: (recommendations:any) => {
          const botMessage: ChatMessage = {
            id: this.generateId(),
            content: "Based on your CV, here are tailored job recommendations:",
            sender: 'bot',
            timestamp: new Date(),
            type: 'suggestions',
            suggestions: recommendations
          };

          this.messages.push(botMessage);
          this.isAnalyzing = false;
          this.cvUploaded = true;
          this.scrollToBottom();
        },
        error: (err) => {
          this.isAnalyzing = false;
          this.messageService.add({ severity: 'error', summary: 'Recommendation Error', detail: err.message });
        }
      });
    },
    error: (err) => {
      this.isAnalyzing = false;
      this.messageService.add({ severity: 'error', summary: 'Upload Error', detail: err.message });
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
}
