import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { RatingModule } from 'primeng/rating';
import { SliderModule } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

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
  selector: 'app-recommend-user',
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
  templateUrl: './recommend-user.component.html',
  styleUrl: './recommend-user.component.scss'
})
export class RecommendUserComponent implements OnInit{
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
  
    getJobTypeSeverity(type: string): 'success' | 'warn' | 'danger' | 'info' {
      switch (type) {
        case 'full-time': return 'success';
        case 'part-time': return 'info';
        case 'contract': return 'warn';
        case 'internship': return 'info';
        default: return 'info';
      }
    }
  
    getStatusSeverity(status: string): 'success' | 'warn' | 'danger' | 'info' {
      switch (status) {
        case 'pending': return 'warn';
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
