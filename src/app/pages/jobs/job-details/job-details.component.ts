import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Job } from '../../../shared/models/job';
import { JobsService } from '../../../shared/services/jobs.service';
/* import { JobOffer } from '../job-application/jobApplication.component';
 */
export interface JobOffer {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string; // Full-time, Part-time, Contract, etc.
  experience: string;
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  skills: string[];
  postedDate: Date;
  applicationDeadline: Date;
  companyLogo?: string;
  department: string;
  contactEmail: string;
  status: 'active' | 'closed' | 'paused';
}


@Component({
  selector: 'app-job-details',
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    ChipModule,
    DividerModule,
    TagModule,
    AvatarModule,
    TooltipModule,
    RippleModule
  ],
  templateUrl: './job-details.component.html',
  styleUrl: './job-details.component.scss'
})
export class JobDetailsComponent implements OnInit{

  constructor(private route:ActivatedRoute,private jobService:JobsService,private router:Router){

  }

  jobId :number = null as any;
  job?:any | null = null;
  @Input() jobOffer: JobOffer | null = null;
  requirements: string[] = [];
  isFavorite = false;

  ngOnInit() {
    this.jobId = this.route.snapshot.params['id'];

    this.retreiveJob();
  
    // Mock data for demonstration
    if (!this.jobOffer) {
      this.jobOffer = this.getMockJobOffer();
    }
  }

  onApply() {
    // Implement application logic

    console.log('Applying for job:', this.jobOffer?.title);
  }


  Recommendation() {
    // Implement application logic
   this.router.navigate(['/app/chatbot']);
    console.log('Applying for job:', this.jobOffer?.title);
  }

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
    // Implement favorite logic
    console.log('Favorite toggled:', this.isFavorite);
  }

  private getMockJobOffer(): JobOffer {
    return {
      id: 1,
      title: 'Développeur Full Stack Senior',
      company: 'ACTIA Engineering Services',
      location: 'Tunis, Tunisia',
      type: 'CDI',
      experience: '5+ ans',
      salary: '3000-4500 TND',
      department: 'IT',
      description: 'Nous recherchons un développeur Full Stack expérimenté pour rejoindre notre équipe dynamique. Vous travaillerez sur des projets innovants utilisant les dernières technologies web et contribuerez au développement de solutions logicielles de haute qualité.',
      requirements: [
        'Diplôme en informatique ou équivalent',
        `Minimum ${this.job?.experience} ans d\'expérience en développement web`,
        'Maîtrise d\'Angular et Spring Boot',
        'Expérience avec les bases de données relationnelles',
        'Connaissance des méthodologies Agile/Scrum'
      ],
      responsibilities: [
        'Développer et maintenir des applications web full-stack',
        'Collaborer avec l\'équipe de design pour implémenter l\'interface utilisateur',
        'Optimiser les performances des applications',
        'Participer aux revues de code et maintenir la qualité du code',
        'Documenter le code et les processus de développement'
      ],
      benefits: [
        'Assurance santé complète',
        'Formation continue et certifications',
        'Environnement de travail flexible',
        'Opportunités d\'évolution de carrière',
        'Prime de performance annuelle'
      ],
      skills: ['Angular', 'Spring Boot', 'TypeScript', 'Java', 'PostgreSQL', 'Git', 'Docker', 'REST API'],
      postedDate: new Date('2024-07-20'),
      applicationDeadline: new Date('2024-08-20'),
      contactEmail: 'recrutement@actia.com',
      status: 'active'
    };
  }

  retreiveJob(){
    this.jobService.getJobById(this.jobId).subscribe({
      next:(data=>{
         
        this.job = data;
        if (this.job.requirements) {
          this.requirements = this.job.requirements.split(',');
          this.job.requirements = this.requirements.map((item: string) => item.trim());
          console.log(this.requirements);
        }
        
        console.log("job retreived : ",this.job);
      }),
      error(err) {
        console.error("error occured fetching the jon : ",err

        )
      },
    })
  }


    applyToJob(jobId: any) {
    //console.log('Applying to job:', job.title);

    // Implement job application logic
    this.router.navigate(['/app/jobapplication', jobId]);
  }


}
