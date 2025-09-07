import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { RatingModule } from 'primeng/rating';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { CheckboxModule } from 'primeng/checkbox';
import { TextareaModule } from 'primeng/textarea';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { SliderModule } from 'primeng/slider';

// PrimeNG Services
import { MessageService, ConfirmationService } from 'primeng/api';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: string;
  skills: string[];
  experience: number;
  profileScore: number;
  avatar?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  lastActive: Date;
  status: 'active' | 'blocked' | 'pending';
}

interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  level: 'junior' | 'mid' | 'senior' | 'lead';
  requiredSkills: string[];
  experience: number;
  salary: { min: number; max: number; currency: string };
  description: string;
  status: 'active' | 'paused' | 'closed';
  postedDate: Date;
  deadline: Date;
  applicationsCount: number;
  recommendationsCount: number;
}

interface Recommendation {
  id: number;
  userId: number;
  jobId: number;
  recommendedBy: number;
  matchScore: number;
  reason: string;
  status: 'pending' | 'accepted' | 'declined' | 'withdrawn';
  createdDate: Date;
  notes?: string;
}

@Component({
  selector: 'app-job-recommendation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    DialogModule,
    CardModule,
    TagModule,
    AvatarModule,
    BadgeModule,
    RatingModule,
    ChipModule,
    DividerModule,
    ToastModule,
    ConfirmDialogModule,
    ToolbarModule,
    CheckboxModule,
    TextareaModule,
    CalendarModule,
    AutoCompleteModule,
    MultiSelectModule,
    ProgressBarModule,
    SliderModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="job-recommendation-container">
      <!-- Header -->
      <p-card styleClass="header-card mb-4">
        <div class="header-content">
          <div class="header-text">
            <h1 class="main-title">Recommandations d'Emploi</h1>
            <p class="subtitle">Recommandez les meilleurs candidats pour vos offres d'emploi</p>
          </div>
          <div class="header-stats">
            <div class="stat-item">
              <span class="stat-number">{{totalRecommendations}}</span>
              <span class="stat-label">Recommandations</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{activeJobs}}</span>
              <span class="stat-label">Postes Actifs</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{matchingCandidates}}</span>
              <span class="stat-label">Candidats</span>
            </div>
          </div>
        </div>
      </p-card>

      <!-- Quick Actions Toolbar -->
      <p-toolbar styleClass="toolbar-custom mb-4">
        <div class="p-toolbar-group-left">
          <p-button 
            label="Nouvelle Recommandation" 
            icon="pi pi-plus" 
            styleClass="p-button-success mr-3"
            (click)="openNewRecommendationDialog()">
          </p-button>
          
          <p-button 
            label="Analyse de Correspondance" 
            icon="pi pi-chart-bar" 
            styleClass="p-button-outlined"
            (click)="openMatchAnalysis()">
          </p-button>
        </div>
        
        <div class="p-toolbar-group-right">
          <span class="p-input-icon-left mr-3">
            <i class="pi pi-search"></i>
            <input 
              type="text" 
              pInputText 
              placeholder="Rechercher poste ou candidat..." 
              [(ngModel)]="searchTerm"
              (input)="onGlobalFilter($event)">
          </span>
          
          <p-dropdown 
            [options]="departmentOptions" 
            [(ngModel)]="selectedDepartment" 
            placeholder="Département"
            [showClear]="true"
            (onChange)="applyFilters()">
          </p-dropdown>
        </div>
      </p-toolbar>

      <!-- Active Jobs Section -->
      <p-card header="Postes Disponibles" styleClass="jobs-card mb-4">
        <div class="jobs-grid">
          <div class="job-card" 
               *ngFor="let job of filteredJobs" 
               [class.selected]="selectedJob?.id === job.id" 
               (click)="selectJob(job)">
            <div class="job-header">
              <div class="job-info">
                <h3 class="job-title">{{job.title}}</h3>
                <p class="job-meta">{{job.department}} • {{job.location}}</p>
              </div>
              <div class="job-badges">
                <p-tag [value]="job.type" [severity]="getJobTypeSeverity(job.type)" class="mr-2"></p-tag>
                <p-tag [value]="job.level" severity="info"></p-tag>
              </div>
            </div>
            
            <div class="job-details">
              <div class="job-salary">
                <i class="pi pi-money-bill mr-2"></i>
                <span>{{formatSalary(job.salary)}}</span>
              </div>
              <div class="job-experience">
                <i class="pi pi-calendar mr-2"></i>
                <span>{{job.experience}}+ ans d'expérience</span>
              </div>
            </div>
            
            <div class="job-skills">
              <p-chip *ngFor="let skill of job.requiredSkills.slice(0, 3)" 
                     [label]="skill" 
                     styleClass="skill-chip mr-2 mb-2">
              </p-chip>
              <span *ngIf="job.requiredSkills.length > 3" class="more-skills">
                +{{job.requiredSkills.length - 3}} autres
              </span>
            </div>
            
            <div class="job-stats">
              <div class="stat">
                <span class="stat-value">{{job.applicationsCount}}</span>
                <span class="stat-label">Candidatures</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{job.recommendationsCount}}</span>
                <span class="stat-label">Recommandations</span>
              </div>
              <div class="job-deadline">
                <i class="pi pi-clock mr-2"></i>
                <span>{{getDaysRemaining(job.deadline)}} jours</span>
              </div>
            </div>
          </div>
        </div>
      </p-card>

      <!-- Candidate Matching Section -->
      <p-card *ngIf="selectedJob" styleClass="candidates-card mb-4">
        <ng-template pTemplate="header">
          <div class="card-header-custom">
            <h3>Candidats pour: {{selectedJob.title}}</h3>
            <div class="header-actions">
              <p-slider [(ngModel)]="minMatchScore" 
                       [min]="0" 
                       [max]="100" 
                       [step]="5"
                       (onChange)="filterByMatchScore()"
                       class="match-slider mr-3">
              </p-slider>
              <span class="match-label">Score min: {{minMatchScore}}%</span>
            </div>
          </div>
        </ng-template>

        <div class="candidates-grid">
          <div class="candidate-card" 
               *ngFor="let candidate of getMatchingCandidates()" 
               [class.recommended]="isRecommended(candidate.id, selectedJob.id)">
            
            <div class="candidate-header">
              <p-avatar [label]="candidate.firstName.charAt(0) + candidate.lastName.charAt(0)"
                       [style]="{'background-color': getAvatarColor(candidate.id)}"
                       size="large">
              </p-avatar>
              
              <div class="candidate-info">
                <h4>{{candidate.firstName}} {{candidate.lastName}}</h4>
                <p class="candidate-role">{{candidate.role}} • {{candidate.department}}</p>
                <p class="candidate-location">{{candidate.location || 'Tunis, TN'}}</p>
              </div>
              
              <div class="candidate-score">
                <div class="score-circle" [class]="getScoreClass(candidate.profileScore)">
                  <span>{{candidate.profileScore}}%</span>
                </div>
                <span class="score-label">Correspondance</span>
              </div>
            </div>
            
            <div class="candidate-details">
              <div class="detail-row">
                <i class="pi pi-briefcase mr-2"></i>
                <span>{{candidate.experience}} ans d'expérience</span>
              </div>
              <div class="detail-row">
                <i class="pi pi-calendar mr-2"></i>
                <span>Actif {{getLastActiveText(candidate.lastActive)}}</span>
              </div>
            </div>
            
            <div class="candidate-skills">
              <p-chip *ngFor="let skill of getMatchingSkills(candidate, selectedJob)" 
                     [label]="skill" 
                     styleClass="matching-skill mr-2 mb-2">
              </p-chip>
              <p-chip *ngFor="let skill of getNonMatchingSkills(candidate, selectedJob).slice(0, 2)" 
                     [label]="skill" 
                     styleClass="other-skill mr-2 mb-2">
              </p-chip>
            </div>
            
            <p-divider></p-divider>
            
            <div class="candidate-actions">
              <p-button 
                icon="pi pi-eye" 
                label="Voir Profil"
                styleClass="p-button-text p-button-sm"
                (click)="viewCandidateProfile(candidate)">
              </p-button>
              
              <p-button 
                *ngIf="!isRecommended(candidate.id, selectedJob.id)"
                icon="pi pi-send" 
                label="Recommander"
                styleClass="p-button-success p-button-sm"
                (click)="recommendCandidate(candidate, selectedJob)">
              </p-button>
              
              <p-button 
                *ngIf="isRecommended(candidate.id, selectedJob.id)"
                icon="pi pi-check" 
                label="Recommandé"
                styleClass="p-button-success p-button-sm"
                [disabled]="true">
              </p-button>
            </div>
          </div>
        </div>
      </p-card>

      <!-- Existing Recommendations -->
      <p-card header="Recommandations Récentes" styleClass="recommendations-card mb-4">
        <p-table [value]="recentRecommendations" 
                [paginator]="true" 
                [rows]="10"
                styleClass="p-datatable-sm">
          
          <ng-template pTemplate="header">
            <tr>
              <th>Candidat</th>
              <th>Poste</th>
              <th>Score</th>
              <th>Statut</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </ng-template>
          
          <ng-template pTemplate="body" let-recommendation>
            <tr>
              <td>
                <div class="candidate-mini">
                  <p-avatar [label]="getCandidateInitials(recommendation.userId)"
                           [style]="{'background-color': getAvatarColor(recommendation.userId)}"
                           size="normal">
                  </p-avatar>
                  <div class="ml-3">
                    <div class="candidate-name">{{getUser(recommendation.userId)?.firstName}} {{getUser(recommendation.userId)?.lastName}}</div>
                    <div class="candidate-email">{{getUser(recommendation.userId)?.email}}</div>
                  </div>
                </div>
              </td>
              <td>
                <div class="job-mini">
                  <div class="job-title-mini">{{getJob(recommendation.jobId)?.title}}</div>
                  <div class="job-department">{{getJob(recommendation.jobId)?.department}}</div>
                </div>
              </td>
              <td>
                <div class="score-mini" [class]="getScoreClass(recommendation.matchScore)">
                  {{recommendation.matchScore}}%
                </div>
              </td>
              <td>
                <p-tag [value]="getStatusLabel(recommendation.status)" 
                      [severity]="getStatusSeverity(recommendation.status)">
                </p-tag>
              </td>
              <td>{{formatDate(recommendation.createdDate)}}</td>
              <td>
                <div class="action-buttons">
                  <p-button 
                    icon="pi pi-eye" 
                    styleClass="p-button-rounded p-button-text p-button-sm mr-2"
                    pTooltip="Voir détails"
                    (click)="viewRecommendation(recommendation)">
                  </p-button>
                  
                  <p-button 
                    icon="pi pi-times" 
                    styleClass="p-button-rounded p-button-text p-button-danger p-button-sm"
                    pTooltip="Retirer"
                    (click)="withdrawRecommendation(recommendation)"
                    [disabled]="recommendation.status !== 'pending'">
                  </p-button>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>

      <!-- New Recommendation Dialog (Select Job and Candidate) -->
      <p-dialog [(visible)]="newRecommendationDialogVisible" 
               [style]="{width: '700px'}" 
               header="Créer une Nouvelle Recommandation"
               [modal]="true"
               [closable]="true">
        
        <div class="new-recommendation-form">
          <div class="form-section">
            <h4>Sélectionner un Poste</h4>
            <div class="job-selection">
              <p-dropdown 
                [options]="jobOptions" 
                [(ngModel)]="selectedJobForRecommendation" 
                optionLabel="title"
                optionValue="value"
                placeholder="Choisir un poste"
                [filter]="true"
                filterBy="title"
                class="w-full">
              </p-dropdown>
            </div>
          </div>

          <div class="form-section" *ngIf="selectedJobForRecommendation">
            <h4>Sélectionner un Candidat</h4>
            <div class="candidate-selection">
              <p-dropdown 
                [options]="candidateOptions" 
                [(ngModel)]="selectedCandidateForRecommendation" 
                optionLabel="fullName"
                optionValue="value"
                placeholder="Choisir un candidat"
                [filter]="true"
                filterBy="fullName"
                class="w-full">
              </p-dropdown>
            </div>
          </div>

          <div class="form-actions">
            <p-button 
              label="Annuler" 
              icon="pi pi-times" 
              styleClass="p-button-text mr-3"
              (click)="closeNewRecommendationDialog()">
            </p-button>
            <p-button 
              label="Continuer" 
              icon="pi pi-arrow-right" 
              styleClass="p-button-success"
              [disabled]="!selectedJobForRecommendation || !selectedCandidateForRecommendation"
              (click)="proceedToRecommendationDetails()">
            </p-button>
          </div>
        </div>
      </p-dialog>

      <!-- Recommendation Dialog -->
      <p-dialog [(visible)]="recommendationDialogVisible" 
               [style]="{width: '600px'}" 
               header="Créer une Recommandation"
               [modal]="true">
        
        <div class="recommendation-form" *ngIf="selectedCandidate && selectedJob">
          <div class="form-section">
            <h4>Candidat Sélectionné</h4>
            <div class="selected-candidate">
              <p-avatar [label]="selectedCandidate.firstName.charAt(0) + selectedCandidate.lastName.charAt(0)"
                       [style]="{'background-color': getAvatarColor(selectedCandidate.id)}">
              </p-avatar>
              <div class="ml-3">
                <h5>{{selectedCandidate.firstName}} {{selectedCandidate.lastName}}</h5>
                <p>{{selectedCandidate.role}} • {{selectedCandidate.experience}} ans d'expérience</p>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h4>Poste</h4>
            <div class="selected-job">
              <h5>{{selectedJob.title}}</h5>
              <p>{{selectedJob.department}} • {{selectedJob.location}}</p>
            </div>
          </div>

          <div class="form-section">
            <label for="recommendationReason">Raison de la recommandation *</label>
            <p-textarea 
              id="recommendationReason"
              [(ngModel)]="recommendationReason" 
              rows="4" 
              cols="50"
              placeholder="Expliquez pourquoi vous recommandez ce candidat..."
              class="w-full mt-2">
            </p-textarea>
          </div>

          <div class="form-section">
            <label for="recommendationNotes">Notes additionnelles</label>
            <p-textarea 
              id="recommendationNotes"
              [(ngModel)]="recommendationNotes" 
              rows="3" 
              cols="50"
              placeholder="Notes privées (optionnel)..."
              class="w-full mt-2">
            </p-textarea>
          </div>

          <div class="calculated-match">
            <h4>Score de Correspondance Calculé</h4>
            <div class="match-breakdown">
              <div class="match-item">
                <span>Compétences correspondantes:</span>
                <p-progressBar [value]="getSkillMatchPercentage(selectedCandidate, selectedJob)" 
                             styleClass="skill-progress">
                </p-progressBar>
                <span>{{getMatchingSkills(selectedCandidate, selectedJob).length}}/{{selectedJob.requiredSkills.length}}</span>
              </div>
              <div class="match-item">
                <span>Expérience:</span>
                <p-progressBar [value]="getExperienceMatchPercentage(selectedCandidate, selectedJob)"
                             styleClass="experience-progress">
                </p-progressBar>
                <span>{{selectedCandidate.experience >= selectedJob.experience ? 'Suffisante' : 'Insuffisante'}}</span>
              </div>
              <div class="overall-score">
                <strong>Score Global: {{calculateOverallMatch(selectedCandidate, selectedJob)}}%</strong>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <p-button 
              label="Annuler" 
              icon="pi pi-times" 
              styleClass="p-button-text mr-3"
              (click)="closeRecommendationDialog()">
            </p-button>
            <p-button 
              label="Créer Recommandation" 
              icon="pi pi-send" 
              styleClass="p-button-success"
              [disabled]="!recommendationReason.trim()"
              (click)="submitRecommendation()">
            </p-button>
          </div>
        </div>
      </p-dialog>

      <!-- Match Analysis Dialog -->
      <p-dialog [(visible)]="matchAnalysisVisible" 
               [style]="{width: '800px'}" 
               header="Analyse de Correspondance"
               [modal]="true">
        
        <div class="match-analysis" *ngIf="selectedJob">
          <div class="analysis-header">
            <h4>Analyse pour: {{selectedJob.title}}</h4>
            <p>Analyse détaillée des candidats potentiels</p>
          </div>

          <div class="analysis-charts">
            <div class="chart-section">
              <h5>Distribution des Scores</h5>
              <div class="score-distribution">
                <div class="score-range" *ngFor="let range of getScoreDistribution()">
                  <span class="range-label">{{range.label}}</span>
                  <p-progressBar [value]="range.percentage" 
                               [style]="{'width': '200px'}"
                               [showValue]="false"
                               class="mx-3">
                  </p-progressBar>
                  <span class="range-count">{{range.count}} candidats</span>
                </div>
              </div>
            </div>

            <div class="chart-section">
              <h5>Compétences Manquantes</h5>
              <div class="missing-skills">
                <p-chip *ngFor="let skill of getMissingSkills()" 
                       [label]="skill.name + ' (' + skill.count + ')'"
                       styleClass="missing-skill-chip mr-2 mb-2">
                </p-chip>
              </div>
            </div>
          </div>
        </div>
      </p-dialog>
    </div>

    <p-toast></p-toast>
    <p-confirmDialog></p-confirmDialog>
  `,
  styles: [`
    job-recommendation-container {
      padding: 1.5rem;
      background-color: #f8f9fa;
      min-height: 100vh;
    }

    /* Spacing utilities */
    .mb-2 { margin-bottom: 0.5rem; }
    .mb-3 { margin-bottom: 0.75rem; }
    .mb-4 { margin-bottom: 1.5rem; }
    .mr-2 { margin-right: 0.5rem; }
    .mr-3 { margin-right: 0.75rem; }
    .ml-3 { margin-left: 0.75rem; }
    .mx-3 { margin-left: 0.75rem; margin-right: 0.75rem; }
    .mt-2 { margin-top: 0.5rem; }

    .header-card {
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
      border: none;
      border-radius: 12px;
    }

    .header-card ::ng-deep .p-card-body {
      padding: 2rem;
      color: white;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 2rem;
    }

    .main-title {
      font-size: 2.5rem;
      font-weight: 300;
      margin: 0 0 0.5rem 0;
      color: white;
    }

    .subtitle {
      font-size: 1.1rem;
      margin: 0;
      opacity: 0.9;
    }

    .header-stats {
      display: flex;
      gap: 2rem;
    }

    .stat-item {
      text-align: center;
    }

    .stat-number {
      display: block;
      font-size: 2rem;
      font-weight: bold;
      color: white;
    }

    .stat-label {
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .toolbar-custom {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .toolbar-custom ::ng-deep .p-toolbar-group-left,
    .toolbar-custom ::ng-deep .p-toolbar-group-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    /* Cards styling */
    .jobs-card,
    .candidates-card,
    .recommendations-card {
      background: white;
      border: 1px solid #dee2e6;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }

    /* Jobs Grid */
    .jobs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 2rem;
      padding: 1rem 0;
    }

    .job-card {
      background: white;
      border: 2px solid #e9ecef;
      border-radius: 12px;
      padding: 2rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .job-card:hover {
      border-color: #28a745;
      box-shadow: 0 4px 12px rgba(40, 167, 69, 0.15);
      transform: translateY(-2px);
    }

    .job-card.selected {
      border-color: #28a745;
      background: #f8fff9;
      box-shadow: 0 4px 12px rgba(40, 167, 69, 0.2);
    }

    .job-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
    }

    .job-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
      color: #212529;
    }

    .job-meta {
      color: #6c757d;
      margin: 0;
      font-size: 0.9rem;
    }

    .job-badges {
      display: flex;
      gap: 0.5rem;
    }

    .job-details {
      display: flex;
      gap: 2rem;
      margin-bottom: 1.5rem;
      font-size: 0.9rem;
      color: #495057;
    }

    .job-details > div {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .job-skills {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 1.5rem;
      min-height: 50px;
      align-items: flex-start;
    }

    .skill-chip {
      background-color: #e3f2fd !important;
      color: #1976d2 !important;
      font-size: 0.85rem !important;
    }

    .more-skills {
      font-size: 0.875rem;
      color: #6c757d;
      font-style: italic;
      margin-top: 0.25rem;
    }

    .job-stats {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1.5rem;
      border-top: 1px solid #e9ecef;
    }

    .stat {
      text-align: center;
    }

    .stat-value {
      display: block;
      font-weight: 600;
      color: #28a745;
      font-size: 1.1rem;
    }

    .stat-label {
      font-size: 0.8rem;
      color: #6c757d;
    }

    .job-deadline {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #dc3545;
      font-size: 0.9rem;
    }

    /* Candidates Section */
    .card-header-custom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .match-slider {
      width: 150px;
    }

    .match-label {
      font-size: 0.9rem;
      color: #495057;
      white-space: nowrap;
    }

    .candidates-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .candidate-card {
      background: white;
      border: 1px solid #e9ecef;
      border-radius: 12px;
      padding: 1.5rem;
      transition: all 0.3s ease;
    }

    .candidate-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      transform: translateY(-2px);
    }

    .candidate-card.recommended {
      border-color: #28a745;
      background: #f8fff9;
    }

    .candidate-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .candidate-info h4 {
      margin: 0 0 0.25rem 0;
      color: #212529;
    }

    .candidate-role,
    .candidate-location {
      margin: 0;
      font-size: 0.9rem;
      color: #6c757d;
    }

    .candidate-score {
      margin-left: auto;
      text-align: center;
    }

    .score-circle {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.9rem;
      margin-bottom: 0.25rem;
    }

    .score-circle.excellent {
      background-color: #d4edda;
      color: #155724;
      border: 2px solid #28a745;
    }

    .score-circle.good {
      background-color: #fff3cd;
      color: #856404;
      border: 2px solid #ffc107;
    }

    .score-circle.fair {
      background-color: #f8d7da;
      color: #721c24;
      border: 2px solid #dc3545;
    }

    .score-label {
      font-size: 0.8rem;
      color: #6c757d;
    }

    .candidate-details {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .detail-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: #495057;
    }

    .candidate-skills {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .matching-skill {
      background-color: #d4edda !important;
      color: #155724 !important;
    }

    .other-skill {
      background-color: #f8f9fa !important;
      color: #495057 !important;
    }

    .candidate-actions {
      display: flex;
      justify-content: space-between;
      gap: 0.5rem;
    }

    /* Recommendations Table */
    .candidate-mini,
    .job-mini {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .candidate-name,
    .job-title-mini {
      font-weight: 500;
      margin-bottom: 0.25rem;
    }

    .candidate-email,
    .job-department {
      font-size: 0.8rem;
      color: #6c757d;
    }

    .score-mini {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-weight: 600;
      font-size: 0.85rem;
      text-align: center;
      min-width: 50px;
    }

    .score-mini.excellent {
      background-color: #d4edda;
      color: #155724;
    }

    .score-mini.good {
      background-color: #fff3cd;
      color: #856404;
    }

    .score-mini.fair {
      background-color: #f8d7da;
      color: #721c24;
    }

    .action-buttons {
      display: flex;
      gap: 0.25rem;
    }

    /* Recommendation Dialog */
    .recommendation-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-section {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-section h4 {
      margin: 0;
      color: #495057;
      font-size: 1.1rem;
    }

    .selected-candidate,
    .selected-job {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background-color: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #e9ecef;
    }

    .selected-candidate h5,
    .selected-job h5 {
      margin: 0 0 0.25rem 0;
      color: #212529;
    }

    .selected-candidate p,
    .selected-job p {
      margin: 0;
      color: #6c757d;
      font-size: 0.9rem;
    }

    .form-section label {
      font-weight: 600;
      color: #495057;
    }

    .calculated-match {
      padding: 1.5rem;
      background-color: #f8fff9;
      border: 1px solid #d4edda;
      border-radius: 8px;
    }

    .calculated-match h4 {
      margin: 0 0 1rem 0;
      color: #155724;
    }

    .match-breakdown {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .match-item {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .match-item span:first-child {
      min-width: 180px;
      font-weight: 500;
    }

    .match-item span:last-child {
      min-width: 80px;
      text-align: right;
      font-size: 0.9rem;
      color: #6c757d;
    }

    .skill-progress,
    .experience-progress {
      width: 150px;
    }

    .overall-score {
      padding: 1rem;
      background-color: #28a745;
      color: white;
      border-radius: 6px;
      text-align: center;
      font-size: 1.1rem;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #e9ecef;
    }

    /* Match Analysis Dialog */
    .match-analysis {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .analysis-header h4 {
      margin: 0 0 0.25rem 0;
      color: #212529;
    }

    .analysis-header p {
      margin: 0;
      color: #6c757d;
    }

    .analysis-charts {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .chart-section h5 {
      margin: 0 0 1rem 0;
      color: #495057;
    }

    .score-distribution {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .score-range {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .range-label {
      min-width: 100px;
      font-weight: 500;
    }

    .range-count {
      min-width: 80px;
      font-size: 0.9rem;
      color: #6c757d;
    }

    .missing-skills {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .missing-skill-chip {
      background-color: #f8d7da !important;
      color: #721c24 !important;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        text-align: center;
      }

      .main-title {
        font-size: 2rem;
      }

      .jobs-grid,
      .candidates-grid {
        grid-template-columns: 1fr;
      }

      .job-header,
      .candidate-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .candidate-score {
        margin-left: 0;
        align-self: flex-end;
      }

      .job-stats {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .toolbar-custom ::ng-deep .p-toolbar-group-left,
      .toolbar-custom ::ng-deep .p-toolbar-group-right {
        flex-direction: column;
        align-items: stretch;
      }

      .card-header-custom {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .match-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .match-item span:first-child {
        min-width: auto;
      }

      .score-range {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }
    }

    /* Custom PrimeNG Overrides */
    ::ng-deep .p-button-success {
      background-color: #28a745;
      border-color: #28a745;
    }

    ::ng-deep .p-button-success:hover {
      background-color: #218838;
      border-color: #1e7e34;
    }

    ::ng-deep .p-tag.p-tag-success {
      background-color: #28a745;
    }

    ::ng-deep .p-tag.p-tag-warning {
      background-color: #ffc107;
      color: #212529;
    }

    ::ng-deep .p-tag.p-tag-danger {
      background-color: #dc3545;
    }

    ::ng-deep .p-tag.p-tag-info {
      background-color: #17a2b8;
    }

    ::ng-deep .p-progressbar .p-progressbar-value {
      background-color: #28a745;
    }

    ::ng-deep .skill-progress .p-progressbar-value {
      background-color: #17a2b8;
    }

    ::ng-deep .experience-progress .p-progressbar-value {
      background-color: #ffc107;
    }

    .jobs-card,
    .candidates-card,
    .recommendations-card {
      background: white;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      margin-bottom: 1.5rem;
    }

    .w-full {
      width: 100%;
    }
  `]
})
export class JobRecommendationComponent implements OnInit {
  // Data arrays
   users: User[] = [];
  jobs: Job[] = [];
  recommendations: Recommendation[] = [];
  
  // Filtered data
  filteredJobs: Job[] = [];
  filteredUsers: User[] = [];
  recentRecommendations: Recommendation[] = [];
  
  // Selected items
  selectedJob: Job | null = null;
  selectedCandidate: User | null = null;
  
  // New recommendation dialog selections
  selectedJobForRecommendation: Job | null = null;
  selectedCandidateForRecommendation: User | null = null;
  
  // Filters
  searchTerm: string = '';
  selectedDepartment: string = '';
  minMatchScore: number = 60;
  
  // Dialog states
  newRecommendationDialogVisible: boolean = false;
  recommendationDialogVisible: boolean = false;
  matchAnalysisVisible: boolean = false;
  
  // Form data
  recommendationReason: string = '';
  recommendationNotes: string = '';
  
  // Options for dropdowns
  departmentOptions = [
    { label: 'IT', value: 'IT' },
    { label: 'RH', value: 'RH' },
    { label: 'Marketing', value: 'Marketing' },
    { label: 'Finance', value: 'Finance' },
    { label: 'Commercial', value: 'Commercial' }
  ];

  jobOptions: { title: string; value: Job }[] = [];
  candidateOptions: { fullName: string; value: User }[] = [];

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadData();
    this.prepareDropdownOptions();
  }

  loadData() {
    // Mock data for users
    this.users = [
      {
        id: 1,
        firstName: 'Ahmed',
        lastName: 'Ben Ali',
        email: 'ahmed.benali@example.com',
        role: 'Développeur Full Stack',
        department: 'IT',
        skills: ['Angular', 'Node.js', 'TypeScript', 'MongoDB', 'Docker'],
        experience: 5,
        profileScore: 92,
        phone: '+216 12 345 678',
        location: 'Tunis, TN',
        linkedin: 'linkedin.com/in/ahmed-benali',
        lastActive: new Date('2024-01-10'),
        status: 'active'
      },
      {
        id: 2,
        firstName: 'Fatima',
        lastName: 'Trabelsi',
        email: 'fatima.trabelsi@example.com',
        role: 'Designer UX/UI',
        department: 'IT',
        skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research'],
        experience: 3,
        profileScore: 85,
        location: 'Sfax, TN',
        lastActive: new Date('2024-01-09'),
        status: 'active'
      },
      {
        id: 3,
        firstName: 'Mohamed',
        lastName: 'Gharbi',
        email: 'mohamed.gharbi@example.com',
        role: 'Chef de Projet',
        department: 'IT',
        skills: ['Scrum', 'Agile', 'JIRA', 'Leadership', 'Planning'],
        experience: 8,
        profileScore: 88,
        location: 'Sousse, TN',
        lastActive: new Date('2024-01-08'),
        status: 'active'
      },
      {
        id: 4,
        firstName: 'Leila',
        lastName: 'Mansouri',
        email: 'leila.mansouri@example.com',
        role: 'Data Scientist',
        department: 'IT',
        skills: ['Python', 'Machine Learning', 'SQL', 'Tableau', 'R'],
        experience: 4,
        profileScore: 90,
        location: 'Tunis, TN',
        lastActive: new Date('2024-01-11'),
        status: 'active'
      },
      {
        id: 5,
        firstName: 'Karim',
        lastName: 'Bouazizi',
        email: 'karim.bouazizi@example.com',
        role: 'Marketing Digital',
        department: 'Marketing',
        skills: ['SEO', 'Google Ads', 'Analytics', 'Social Media', 'Content Marketing'],
        experience: 6,
        profileScore: 78,
        location: 'Monastir, TN',
        lastActive: new Date('2024-01-07'),
        status: 'active'
      }
    ];

    // Mock data for jobs
    this.jobs = [
      {
        id: 1,
        title: 'Développeur Angular Senior',
        department: 'IT',
        location: 'Tunis',
        type: 'full-time',
        level: 'senior',
        requiredSkills: ['Angular', 'TypeScript', 'RxJS', 'NgRx', 'Node.js'],
        experience: 5,
        salary: { min: 45000, max: 65000, currency: 'TND' },
        description: 'Nous recherchons un développeur Angular expérimenté...',
        status: 'active',
        postedDate: new Date('2024-01-01'),
        deadline: new Date('2024-02-15'),
        applicationsCount: 15,
        recommendationsCount: 3
      },
      {
        id: 2,
        title: 'UX/UI Designer',
        department: 'IT',
        location: 'Sfax',
        type: 'full-time',
        level: 'mid',
        requiredSkills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research', 'Design Systems'],
        experience: 3,
        salary: { min: 30000, max: 45000, currency: 'TND' },
        description: 'Rejoignez notre équipe design...',
        status: 'active',
        postedDate: new Date('2024-01-05'),
        deadline: new Date('2024-02-20'),
        applicationsCount: 22,
        recommendationsCount: 1
      },
      {
        id: 3,
        title: 'Data Scientist',
        department: 'IT',
        location: 'Tunis',
        type: 'full-time',
        level: 'mid',
        requiredSkills: ['Python', 'Machine Learning', 'SQL', 'Pandas', 'Scikit-learn'],
        experience: 3,
        salary: { min: 40000, max: 55000, currency: 'TND' },
        description: 'Opportunité passionnante en science des données...',
        status: 'active',
        postedDate: new Date('2024-01-08'),
        deadline: new Date('2024-02-25'),
        applicationsCount: 18,
        recommendationsCount: 2
      }
    ];

    // Mock recommendations
    this.recommendations = [
      {
        id: 1,
        userId: 1,
        jobId: 1,
        recommendedBy: 100,
        matchScore: 92,
        reason: 'Excellent profil technique avec expérience Angular solide',
        status: 'pending',
        createdDate: new Date('2024-01-10'),
        notes: 'Candidat très motivé, entretien recommandé'
      },
      {
        id: 2,
        userId: 2,
        jobId: 2,
        recommendedBy: 100,
        matchScore: 85,
        reason: 'Portfolio impressionnant et expérience UX pertinente',
        status: 'accepted',
        createdDate: new Date('2024-01-09')
      }
    ];

    this.applyFilters();
    this.loadRecentRecommendations();
  }

  prepareDropdownOptions() {
    // Prepare job options for dropdown
    this.jobOptions = this.jobs
      .filter(job => job.status === 'active')
      .map(job => ({
        title: `${job.title} - ${job.department} (${job.location})`,
        value: job
      }));

    // Prepare candidate options for dropdown
    this.candidateOptions = this.users
      .filter(user => user.status === 'active')
      .map(user => ({
        fullName: `${user.firstName} ${user.lastName} - ${user.role}`,
        value: user
      }));
  }

  applyFilters() {
    let filtered = [...this.jobs];

    if (this.searchTerm) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        job.department.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedDepartment) {
      filtered = filtered.filter(job => job.department === this.selectedDepartment);
    }

    this.filteredJobs = filtered.filter(job => job.status === 'active');
  }

  loadRecentRecommendations() {
    this.recentRecommendations = [...this.recommendations]
      .sort((a, b) => b.createdDate.getTime() - a.createdDate.getTime())
      .slice(0, 10);
  }

  // Getters for statistics
  get totalRecommendations(): number {
    return this.recommendations.length;
  }

  get activeJobs(): number {
    return this.jobs.filter(job => job.status === 'active').length;
  }

  get matchingCandidates(): number {
    if (!this.selectedJob) return this.users.length;
    return this.getMatchingCandidates().length;
  }

  // Event handlers
  onGlobalFilter(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.applyFilters();
  }

  selectJob(job: Job) {
    this.selectedJob = job;
  }

  filterByMatchScore() {
    // Filter is applied in getMatchingCandidates method
  }

  // Dialog handlers for new recommendation
  openNewRecommendationDialog() {
    this.newRecommendationDialogVisible = true;
    this.selectedJobForRecommendation = null;
    this.selectedCandidateForRecommendation = null;
  }

  closeNewRecommendationDialog() {
    this.newRecommendationDialogVisible = false;
    this.selectedJobForRecommendation = null;
    this.selectedCandidateForRecommendation = null;
  }

  proceedToRecommendationDetails() {
    if (this.selectedJobForRecommendation && this.selectedCandidateForRecommendation) {
      this.selectedJob = this.selectedJobForRecommendation;
      this.selectedCandidate = this.selectedCandidateForRecommendation;
      this.closeNewRecommendationDialog();
      this.openRecommendationDialog();
    }
  }

  // Existing dialog handlers
  openRecommendationDialog() {
    this.recommendationDialogVisible = true;
  }

  closeRecommendationDialog() {
    this.recommendationDialogVisible = false;
    this.recommendationReason = '';
    this.recommendationNotes = '';
  }

  openMatchAnalysis() {
    if (!this.selectedJob) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Veuillez d\'abord sélectionner un poste'
      });
      return;
    }
    this.matchAnalysisVisible = true;
  }

  // Candidate matching logic
  getMatchingCandidates(): User[] {
    if (!this.selectedJob) return [];

    return this.users
      .filter(user => user.status === 'active')
      .map(user => ({
        ...user,
        profileScore: this.calculateOverallMatch(user, this.selectedJob!)
      }))
      .filter(user => user.profileScore >= this.minMatchScore)
      .sort((a, b) => b.profileScore - a.profileScore);
  }

  calculateOverallMatch(user: User, job: Job): number {
    const skillMatch = this.getSkillMatchPercentage(user, job);
    const experienceMatch = this.getExperienceMatchPercentage(user, job);
    
    // Weighted average: 70% skills, 30% experience
    return Math.round(skillMatch * 0.7 + experienceMatch * 0.3);
  }

  getSkillMatchPercentage(user: User, job: Job): number {
    const matchingSkills = this.getMatchingSkills(user, job);
    return (matchingSkills.length / job.requiredSkills.length) * 100;
  }

  getExperienceMatchPercentage(user: User, job: Job): number {
    if (user.experience >= job.experience) return 100;
    return (user.experience / job.experience) * 100;
  }

  getMatchingSkills(user: User, job: Job): string[] {
    return user.skills.filter(skill => 
      job.requiredSkills.some(reqSkill => 
        reqSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(reqSkill.toLowerCase())
      )
    );
  }

  getNonMatchingSkills(user: User, job: Job): string[] {
    const matchingSkills = this.getMatchingSkills(user, job);
    return user.skills.filter(skill => !matchingSkills.includes(skill));
  }

  // Action handlers
  viewCandidateProfile(candidate: User) {
    this.messageService.add({
      severity: 'info',
      summary: 'Profil',
      detail: `Consultation du profil de ${candidate.firstName} ${candidate.lastName}`
    });
  }

  recommendCandidate(candidate: User, job: Job) {
    this.selectedCandidate = candidate;
    this.selectedJob = job;
    this.openRecommendationDialog();
  }

  submitRecommendation() {
    if (!this.selectedCandidate || !this.selectedJob || !this.recommendationReason.trim()) {
      return;
    }

    const newRecommendation: Recommendation = {
      id: this.recommendations.length + 1,
      userId: this.selectedCandidate.id,
      jobId: this.selectedJob.id,
      recommendedBy: 100, // Current admin ID
      matchScore: this.calculateOverallMatch(this.selectedCandidate, this.selectedJob),
      reason: this.recommendationReason,
      status: 'pending',
      createdDate: new Date(),
      notes: this.recommendationNotes
    };

    this.recommendations.push(newRecommendation);
    this.loadRecentRecommendations();

    this.messageService.add({
      severity: 'success',
      summary: 'Succès',
      detail: `Recommandation créée pour ${this.selectedCandidate.firstName} ${this.selectedCandidate.lastName}`
    });

    this.closeRecommendationDialog();
  }

  withdrawRecommendation(recommendation: Recommendation) {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir retirer cette recommandation ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        recommendation.status = 'withdrawn';
        this.messageService.add({
          severity: 'info',
          summary: 'Recommandation retirée',
          detail: 'La recommandation a été retirée avec succès'
        });
      }
    });
  }

  viewRecommendation(recommendation: Recommendation) {
    this.messageService.add({
      severity: 'info',
      summary: 'Détails',
      detail: 'Consultation des détails de la recommandation'
    });
  }

  // Utility methods
  isRecommended(userId: number, jobId: number): boolean {
    return this.recommendations.some(rec => 
      rec.userId === userId && 
      rec.jobId === jobId && 
      rec.status !== 'withdrawn'
    );
  }

  getUser(userId: number): User | undefined {
    return this.users.find(user => user.id === userId);
  }

  getJob(jobId: number): Job | undefined {
    return this.jobs.find(job => job.id === jobId);
  }

  getCandidateInitials(userId: number): string {
    const user = this.getUser(userId);
    if (!user) return 'NA';
    return user.firstName.charAt(0) + user.lastName.charAt(0);
  }

  getJobTypeSeverity(type: string): 'success' | 'warning' | 'danger' | 'info' {
    switch (type) {
      case 'full-time': return 'success';
      case 'part-time': return 'info';
      case 'contract': return 'warning';
      case 'internship': return 'info';
      default: return 'info';
    }
  }

  getStatusSeverity(status: string): 'success' | 'warning' | 'danger' | 'info' {
    switch (status) {
      case 'pending': return 'warning';
      case 'accepted': return 'success';
      case 'declined': return 'danger';
      case 'withdrawn': return 'info';
      default: return 'info';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending': return 'En attente';
      case 'accepted': return 'Acceptée';
      case 'declined': return 'Refusée';
      case 'withdrawn': return 'Retirée';
      default: return status;
    }
  }

  getScoreClass(score: number): string {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    return 'fair';
  }

  getAvatarColor(userId: number): string {
    const colors = ['#28a745', '#17a2b8', '#ffc107', '#dc3545', '#6f42c1', '#20c997'];
    return colors[userId % colors.length];
  }

  formatSalary(salary: { min: number; max: number; currency: string }): string {
    return `${salary.min} - ${salary.max} ${salary.currency}`;
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }

  getDaysRemaining(deadline: Date): number {
    const today = new Date();
    const timeDiff = deadline.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  getLastActiveText(lastActive: Date): string {
    const today = new Date();
    const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 3600 * 24));
    
    if (daysDiff === 0) return 'aujourd\'hui';
    if (daysDiff === 1) return 'hier';
    if (daysDiff < 7) return `il y a ${daysDiff} jours`;
    if (daysDiff < 30) return `il y a ${Math.floor(daysDiff / 7)} semaine(s)`;
    return `il y a ${Math.floor(daysDiff / 30)} mois`;
  }

  // Match analysis methods
  getScoreDistribution(): { label: string; percentage: number; count: number }[] {
    if (!this.selectedJob) return [];

    const candidates = this.getMatchingCandidates();
    const total = candidates.length;

    if (total === 0) {
      return [
        { label: 'Excellent (80%+)', percentage: 0, count: 0 },
        { label: 'Bon (60-79%)', percentage: 0, count: 0 },
        { label: 'Moyen (<60%)', percentage: 0, count: 0 }
      ];
    }

    const excellent = candidates.filter(c => c.profileScore >= 80).length;
    const good = candidates.filter(c => c.profileScore >= 60 && c.profileScore < 80).length;
    const fair = candidates.filter(c => c.profileScore < 60).length;

    return [
      { 
        label: 'Excellent (80%+)', 
        percentage: (excellent / total) * 100, 
        count: excellent 
      },
      { 
        label: 'Bon (60-79%)', 
        percentage: (good / total) * 100, 
        count: good 
      },
      { 
        label: 'Moyen (<60%)', 
        percentage: (fair / total) * 100, 
        count: fair 
      }
    ];
  }

  getMissingSkills(): { name: string; count: number }[] {
    if (!this.selectedJob) return [];

    const candidates = this.getMatchingCandidates();
    const missingSkillsMap = new Map<string, number>();

    if (candidates.length === 0) return [];

    candidates.forEach(candidate => {
      const userSkills = candidate.skills.map(s => s.toLowerCase());
      this.selectedJob!.requiredSkills.forEach(reqSkill => {
        if (!userSkills.some(userSkill => 
          userSkill.includes(reqSkill.toLowerCase()) || 
          reqSkill.toLowerCase().includes(userSkill)
        )) {
          missingSkillsMap.set(reqSkill, (missingSkillsMap.get(reqSkill) || 0) + 1);
        }
      });
    });

    return Array.from(missingSkillsMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }
}