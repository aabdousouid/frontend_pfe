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
    RadioButtonModule,
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
  {
    id: 'JD006',
    title: 'Java Backend Developer',
    type: 'CDI',
    company: 'BankSoft',
    location: 'Tunis',
    description: 'Develop RESTful APIs using Java Spring Boot.',
    requirements: 'Good knowledge of Spring Boot and PostgreSQL.',
    skills: 'Java SpringBoot Hibernate PostgreSQL REST Git'
  },
  {
    id: 'JD007',
    title: 'React Developer Intern',
    type: 'STAGE_PFE',
    company: 'InnovateX',
    location: 'Remote',
    description: 'Build UI components for SaaS dashboard.',
    requirements: 'Basic knowledge of React and state management.',
    skills: 'React JavaScript HTML CSS Redux'
  },
  {
    id: 'JD008',
    title: 'Cybersecurity Intern',
    type: 'STAGE_ETE',
    company: 'SecureIT',
    location: 'Tunis',
    description: 'Assist in penetration testing and security audits.',
    requirements: 'Familiarity with OWASP and ethical hacking tools.',
    skills: 'KaliLinux BurpSuite OWASP Nmap Linux'
  },
  {
    id: 'JD009',
    title: 'Mobile Developer',
    type: 'CDI',
    company: 'AppMakers',
    location: 'Sfax',
    description: 'Develop cross-platform apps using Flutter.',
    requirements: 'Experience with Dart and Firebase.',
    skills: 'Flutter Dart Firebase REST Git'
  },
  {
    id: 'JD010',
    title: 'BI Developer',
    type: 'CDI',
    company: 'InsightBI',
    location: 'Tunis',
    description: 'Create dashboards and reports using Power BI.',
    requirements: 'Knowledge of SQL, DAX, and Power BI.',
    skills: 'PowerBI SQL DAX Excel ETL'
  },
  {
    id: 'JD011',
    title: 'Machine Learning Engineer',
    type: 'CDI',
    company: 'DeepAnalytics',
    location: 'Tunis',
    description: 'Build ML pipelines and deploy models.',
    requirements: 'Strong skills in Python, scikit-learn, and TensorFlow.',
    skills: 'Python TensorFlow Scikit-learn Pandas NumPy MLflow'
  },
  {
    id: 'JD012',
    title: 'Fullstack JS Developer',
    type: 'CDI',
    company: 'CodeBase',
    location: 'Ariana',
    description: 'Develop and maintain web applications.',
    requirements: 'Experience with Node.js and Angular.',
    skills: 'Node.js Angular MongoDB ExpressJS TypeScript'
  },
  {
    id: 'JD013',
    title: 'Embedded Software Engineer',
    type: 'CDI',
    company: 'AutoTech',
    location: 'Sousse',
    description: 'Work on firmware and real-time systems.',
    requirements: 'Experience with C/C++ and RTOS.',
    skills: 'C C++ RTOS CAN Microcontrollers'
  },
  {
    id: 'JD014',
    title: 'QA Tester Intern',
    type: 'STAGE_PFE',
    company: 'TestLab',
    location: 'Tunis',
    description: 'Write and execute test cases.',
    requirements: 'Knowledge of Selenium and testing frameworks.',
    skills: 'Selenium Java JUnit TestNG'
  },
  {
    id: 'JD015',
    title: 'Web Developer Intern',
    type: 'STAGE_ETE',
    company: 'WebFlow',
    location: 'Nabeul',
    description: 'Build responsive websites.',
    requirements: 'HTML, CSS, and JavaScript knowledge.',
    skills: 'HTML CSS JavaScript Bootstrap'
  },
  {
    id: 'JD016',
    title: 'Data Analyst',
    type: 'CDI',
    company: 'SmartData',
    location: 'Tunis',
    description: 'Analyze data and create business reports.',
    requirements: 'Good Excel and SQL skills.',
    skills: 'Excel SQL Tableau PowerBI Statistics'
  },
  {
    id: 'JD017',
    title: 'AI Research Intern',
    type: 'STAGE_ETE',
    company: 'AI Lab',
    location: 'Remote',
    description: 'Experiment with NLP and LLMs.',
    requirements: 'Basic experience with Transformers and Python.',
    skills: 'Python Transformers HuggingFace NLP PyTorch'
  },
  {
    id: 'JD018',
    title: 'Cloud Engineer',
    type: 'CDI',
    company: 'CloudWare',
    location: 'Tunis',
    description: 'Manage cloud deployments and serverless apps.',
    requirements: 'Experience with AWS or GCP.',
    skills: 'AWS GCP Lambda Terraform CI/CD Docker'
  },
  {
    id: 'JD019',
    title: 'Support Technician Intern',
    type: 'STAGE_ETE',
    company: 'TechHelp',
    location: 'Tunis',
    description: 'Handle level-1 support tickets and configurations.',
    requirements: 'Basic hardware/software troubleshooting.',
    skills: 'Windows Networking ITSupport Hardware'
  },
  {
    id: 'JD020',
    title: 'DevSecOps Engineer',
    type: 'CDI',
    company: 'SecurePipeline',
    location: 'Remote',
    description: 'Integrate security in CI/CD pipelines.',
    requirements: 'Security automation knowledge.',
    skills: 'DevOps Jenkins OWASP Docker GitLabCI'
  }
      ];

      this.chatbotService.matchJobs(parsedCV, mockJobs).subscribe({
        next: (matchedJobs: any[]) => {
          console.log(matchedJobs);
          this.messages.push({
            id: this.generateId(),
            content: "Based on your CV, here are tailored job recommendations:",
            sender: 'bot',
            timestamp: new Date(),
            type: 'suggestions',
            suggestions: matchedJobs.map(job => ({
              title: job.job_title,
              matchPercentage: Math.round(job.overall_score * 100),
              requiredSkills: job.job_description.skills?.split(' ') || [],
              experienceLevel: job.job_description.requirements || '',
              salaryRange: 'N/A',
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
}
