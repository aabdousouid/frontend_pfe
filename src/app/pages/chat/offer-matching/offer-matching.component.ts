import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { KnobModule } from 'primeng/knob';
import { PanelModule } from 'primeng/panel';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';
import { StorageService } from '../../../shared/services/storage.service';
import { UserService } from '../../../shared/services/user.service';
import { ChatbotService } from '../../../shared/services/chatbot.service';
import { firstValueFrom } from 'rxjs';
import { JobsService } from '../../../shared/services/jobs.service';


interface MatchStrength {
  skill: string;
  level: number;
  description: string;
}

interface MatchWeakness {
  skill: string;
  impact: string;
  suggestion: string;
}

interface MatchAssessment {
  score: number;
  level: string;
  strengths: MatchStrength[];
  weaknesses: MatchWeakness[];
  recommendations: string[];
  keyInsights: string[];
}

@Component({
  selector: 'app-offer-matching',
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    ProgressBarModule,
    ChipModule,
    DividerModule,
    TagModule,
    AvatarModule,
    KnobModule,
    TimelineModule,
    FormsModule,
    PanelModule
  ],
  templateUrl: './offer-matching.component.html',
  styleUrl: './offer-matching.component.scss'
})
export class OfferMatchingComponent {
jobId: number = 0;
  loading: boolean = true;
  animatedScore: number = 0;
  parsedCv:any;
  
  jobData: any = {
    title: "Développeur Full Stack Senior",
    company: "ACTIA Engineering Services",
    location: "Tunis, Tunisia",
    type: "CDI",
    companyLogo: "",
    skills: ["Angular", "Spring Boot", "TypeScript", "Java", "PostgreSQL", "Git", "Docker", "REST API"]
  };

  matchAssessment: MatchAssessment = {
    score: 78,
    level: "Bon Match",
    strengths: [
      {
        skill: "Angular & TypeScript",
        level: 95,
        description: "Excellente maîtrise du framework Angular avec 4 ans d'expérience"
      },
      {
        skill: "Spring Boot",
        level: 85,
        description: "Solide expérience en développement backend avec Spring"
      },
      {
        skill: "PostgreSQL",
        level: 80,
        description: "Bonne connaissance des bases de données relationnelles"
      },
      {
        skill: "REST API",
        level: 90,
        description: "Expérience confirmée en conception et intégration d'APIs"
      }
    ],
    weaknesses: [
      {
        skill: "Docker",
        impact: "Moyen",
        suggestion: "Suivre une formation sur Docker et conteneurisation"
      },
      {
        skill: "Expérience 5+ ans",
        impact: "Faible",
        suggestion: "Vous avez 4 ans d'expérience, proche de l'exigence"
      }
    ],
    recommendations: [
      "Mettre en avant vos projets Angular récents dans votre lettre de motivation",
      "Préparer des exemples concrets de vos contributions en Spring Boot",
      "Mentionner votre capacité d'apprentissage rapide pour combler les lacunes en Docker",
      "Souligner votre expérience en méthodologie Agile si applicable"
    ],
    keyInsights: [
      "Votre profil technique correspond bien aux exigences principales",
      "Votre expérience en développement full-stack est un atout majeur",
      "Les compétences manquantes peuvent être acquises rapidement",
      "Le poste correspond à votre niveau d'expérience actuel"
    ]
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storageService :StorageService,
    private userService: UserService,
    private chatbotService: ChatbotService,
    private jobService : JobsService,
  ) {}

async ngOnInit() {
  this.jobId = +this.route.snapshot.params['id'];

  this.jobService.getJobById(this.jobId).subscribe({
    next: (job) => {
      this.jobData = job;
    },
    error:(err)=>{
        console.error("Error fetching job data:", err);
    }
})

  try {
    const userId = this.storageService.getUser().id;

    const profile = await firstValueFrom(this.userService.getProfileByUser(userId));
    console.log("UserProfile:", profile);

    if (!profile?.cvFilePath) {
      console.warn("No CV found in profile. Ask user to upload one.");
      this.loading = false;
      return;
    }

    this.parsedCv = await this.chatbotService.parseCvOfUser(userId);
    console.log("Parsed CV:", this.parsedCv);

    // NEW: match & update UI
    const normalizedJob = this.normalizeJob(this.jobData);
    const matches = await firstValueFrom(this.chatbotService.matchJobs(this.parsedCv, [normalizedJob]));
    const top = matches[0];
    this.updateAssessmentFromMatch(top);

  } catch (err) {
    console.error("Error while initializing Offer Matching:", err);
  } finally {
    this.loading = false;
  }
}


  loadJobAndAssessment() {
    // Simulate API call
    setTimeout(() => {
      this.animateScore();
      this.loading = false;
    }, 1000);
  }

  animateScore() {
    const targetScore = this.matchAssessment.score;
    const duration = 2000;
    const steps = 60;
    const increment = targetScore / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      this.animatedScore = Math.min(Math.round(increment * currentStep), targetScore);
      
      if (currentStep >= steps) {
        clearInterval(interval);
        this.animatedScore = targetScore;
      }
    }, duration / steps);
  }

  getScoreColor(): string {
    if (this.matchAssessment.score >= 80) return 'success';
    if (this.matchAssessment.score >= 60) return 'warning';
    return 'danger';
  }

  getScoreSeverity(): 'success' | 'info' | 'warning' | 'danger' {
    if (this.matchAssessment.score >= 80) return 'success';
    if (this.matchAssessment.score >= 60) return 'warning';
    return 'danger';
  }

  getImpactSeverity(impact: string): 'success' | 'info' | 'warning' | 'danger' {
    switch(impact.toLowerCase()) {
      case 'élevé': return 'danger';
      case 'moyen': return 'warning';
      case 'faible': return 'info';
      default: return 'info';
    }
  }

  generateQuiz() {
    // Navigate to quiz generation
    console.log('Generating quiz for job:', this.jobId);
    this.router.navigate(['/app/quiz', this.jobId]);
  }

  applyToJob() {
    this.router.navigate(['/app/jobapplication', this.jobId]);
  }

  goBack() {
    this.router.navigate(['/app/job-details', this.jobId]);
  }

  private normalizeJob(job: any) {
  const skills = Array.isArray(job.skills)
    ? job.skills
    : typeof job.skills === 'string'
      ? job.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
      : [];

  return {
    job_id: this.jobId ?? 0,
    job_title: job.title,
    company: job.company,
    job_type: job.type,
    description: job.description || '',
    requirements: job.requirements || '',
    skills
  };
}


private scoreToLevel(score: number) {
  if (score >= 80) return 'Excellent';
  if (score >= 65) return 'Bon';
  if (score >= 50) return 'Moyen';
  return 'Faible';
}


private impactForScore(score: number) {
  // your getImpactSeverity expects: 'élevé' | 'moyen' | 'faible'
  if (score >= 75) return 'faible';
  if (score >= 55) return 'moyen';
  return 'élevé';
}

private updateAssessmentFromMatch(top: any) {
  const score = Math.max(0, Math.min(100, Math.round(top?.similarity_score || 0)));
  const matchingSkills: string[] = Array.isArray(top?.matching_skills) ? top.matching_skills : [];
  const missingSkills: string[] = Array.isArray(top?.missing_skills) ? top.missing_skills : [];
  const suggestions: string[] = Array.isArray(top?.suggested_improvements) ? top.suggested_improvements : [];

  this.matchAssessment = {
    score,
    level: this.scoreToLevel(score),
    strengths: matchingSkills.map(s => ({
      skill: s,
      level: 70 + Math.round(Math.random() * 30),
      description: `Bonne adéquation sur ${s}`
    })),
    weaknesses: missingSkills.slice(0, 6).map(s => ({
      skill: s,
      impact: this.impactForScore(score), // 'élevé' | 'moyen' | 'faible'
      suggestion: `Renforcez ${s} pour augmenter votre score.`
    })),
    recommendations: suggestions.length
      ? suggestions
      : [
          'Mettez à jour votre résumé avec les mots-clés du poste.',
          'Ajoutez 1–2 projets pertinents dans votre CV.',
          'Préparez des exemples STAR pour l’entretien.'
        ],
    keyInsights: [
      `Compétences qui matchent: ${matchingSkills.slice(0, 6).join(', ') || '—'}`,
      `À combler: ${missingSkills.slice(0, 6).join(', ') || 'Rien de critique'}`,
      `Score global: ${score}%`
    ]
  };

  this.animateScore();
}


}
