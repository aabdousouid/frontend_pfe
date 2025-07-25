import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
/* import { JobOffer } from '../../jobs/job-application/jobApplication.component';
 */import { TextareaModule } from 'primeng/textarea';
import { FormsModule } from '@angular/forms';
interface JobOffer {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  status: 'active' | 'closed' | 'draft';
  applicants: number;
  datePosted: Date;
  urgency: 'high' | 'medium' | 'low';
}

interface Candidate {
  id: number;
  name: string;
  email: string;
  position: string;
  score: number;
  status: 'pending' | 'interview' | 'accepted' | 'rejected';
  appliedDate: Date;
  avatar?: string;
}
@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule,
    CardModule,
    ButtonModule,
    TableModule,
    TagModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    ProgressBarModule,
    ChartModule,
    TabViewModule,
    DialogModule,
    TextareaModule,
    FileUploadModule,
    AvatarModule,
    BadgeModule,
    FormsModule,
    MenuModule,
    TooltipModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit{
activeJobs = 12;
  pendingCandidates = 45;
  scheduledInterviews = 8;
  hiringRate = 78;

  jobSearchTerm = '';
  candidateSearchTerm = '';
  showCreateJobDialog = false;

  // Sample data
  jobOffers: JobOffer[] = [
    {
      id: 1,
      title: 'Développeur Full Stack',
      department: 'IT',
      location: 'Paris, France',
      type: 'CDI',
      status: 'active',
      applicants: 15,
      datePosted: new Date('2024-07-15'),
      urgency: 'high'
    },
    {
      id: 2,
      title: 'Chef de Projet Digital',
      department: 'Marketing',
      location: 'Lyon, France',
      type: 'CDI',
      status: 'active',
      applicants: 8,
      datePosted: new Date('2024-07-10'),
      urgency: 'medium'
    }
  ];

  recentCandidates: Candidate[] = [
    {
      id: 1,
      name: 'Sophie Martin',
      email: 'sophie.martin@email.com',
      position: 'Développeur Full Stack',
      score: 92,
      status: 'interview',
      appliedDate: new Date('2024-07-18')
    },
    {
      id: 2,
      name: 'Thomas Dubois',
      email: 'thomas.dubois@email.com',
      position: 'Chef de Projet Digital',
      score: 85,
      status: 'pending',
      appliedDate: new Date('2024-07-17')
    }
  ];

  // Dropdown options
  statusOptions = [
    { label: 'Tous', value: null },
    { label: 'Active', value: 'active' },
    { label: 'Fermée', value: 'closed' },
    { label: 'Brouillon', value: 'draft' }
  ];

  candidateStatusOptions = [
    { label: 'Tous', value: null },
    { label: 'En Attente', value: 'pending' },
    { label: 'Entretien', value: 'interview' },
    { label: 'Accepté', value: 'accepted' },
    { label: 'Refusé', value: 'rejected' }
  ];

  departments = [
    { label: 'IT', value: 'IT' },
    { label: 'Marketing', value: 'Marketing' },
    { label: 'RH', value: 'RH' },
    { label: 'Finance', value: 'Finance' }
  ];

  contractTypes = [
    { label: 'CDI', value: 'CDI' },
    { label: 'CDD', value: 'CDD' },
    { label: 'Stage', value: 'Stage' },
    { label: 'Freelance', value: 'Freelance' }
  ];

  // New job form
  newJob = {
    title: '',
    department: '',
    location: '',
    type: '',
    description: ''
  };

  // Chart data
  chartData: any;
  chartOptions: any;
  doughnutData: any;
  doughnutOptions: any;

  ngOnInit() {
    this.initializeCharts();
  }

  initializeCharts() {
    this.chartData = {
      labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
      datasets: [{
        label: 'Candidatures',
        data: [65, 78, 90, 85, 95, 88],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4
      }]
    };

    this.chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      }
    };

    this.doughnutData = {
      labels: ['En Attente', 'Entretien', 'Accepté', 'Refusé'],
      datasets: [{
        data: [45, 15, 8, 12],
        backgroundColor: ['#6b7280', '#3b82f6', '#10b981', '#ef4444']
      }]
    };
  }

  // Helper methods
  getJobStatusSeverity(status: string): string {
    switch (status) {
      case 'active': return 'success';
      case 'closed': return 'danger';
      case 'draft': return 'warning';
      default: return 'info';
    }
  }

  getCandidateStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'pending': 'En Attente',
      'interview': 'Entretien',
      'accepted': 'Accepté',
      'rejected': 'Refusé'
    };
    return labels[status] || status;
  }

  getCandidateStatusSeverity(status: string): string {
    switch (status) {
      case 'accepted': return 'success';
      case 'interview': return 'info';
      case 'pending': return 'warning';
      case 'rejected': return 'danger';
      default: return 'info';
    }
  }

  getScoreClass(score: number): string {
    if (score >= 80) return 'score-high';
    if (score >= 60) return 'score-medium';
    return 'score-low';
  }

  createJob() {
    // Implement job creation logic
    console.log('Creating job:', this.newJob);
    this.showCreateJobDialog = false;
    // Reset form
    this.newJob = {
      title: '',
      department: '',
      location: '',
      type: '',
      description: ''
    };
  }
}
