import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { PaginatorModule } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { Dialog, DialogModule } from 'primeng/dialog';
import { StepperModule } from 'primeng/stepper';
import { ToggleButton, ToggleButtonModule } from 'primeng/togglebutton';
import { JobsService } from '../../shared/services/jobs.service';
import { MessageModule } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { Job } from '../../shared/models/job';
import { MessageService, ToastMessageOptions } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { StorageService } from '../../shared/services/storage.service';
import { Router } from '@angular/router';
/* export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  experience: string;
  salary: string;
  
  requirements: string[];
  skills: string[];
  postedDate: Date;
  isUrgent?: boolean;
  companyLogo?: string;
  isActive?:boolean;
}  */

export interface FilterOptions {
  locations: { label: string; value: string }[];
  jobTypes: { label: string; value: string }[];
  experienceLevels: { label: string; value: string }[];
  skills: { label: string; value: string }[];
}

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [
    ToggleButtonModule,
    CommonModule,
    FormsModule,
    TextareaModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    MultiSelectModule,
    TagModule,
    BadgeModule,
    ToastModule,
    PaginatorModule,
    SkeletonModule,
    RippleModule,
    TooltipModule,
    ChipModule,
    DividerModule,
    DialogModule,
    StepperModule,
    MessageModule,
    SelectModule,
    ToggleSwitchModule
    /* ToggleButton */

  ],
  templateUrl:'./jobList.component.html',
  styleUrl: './jobList.component.scss',
  providers: [MessageService]
})
export class JobListComponent implements OnInit {

  
  job!: Job ;



  form: any={
    title: '',
    company: '',
    description: '',
    location: '',
    jobType:'' ,
    experience:'',
    salary: '',
    requirements: '',
    skills:[],
    postedDate: new Date(),
    isActive:true,
    isUrgent: false,
  }
  constructor(private jobService:JobsService,private service:MessageService, private storageService:StorageService,private router:Router) { 
    
  }
showSuccessViaToast() {
        console.log('Success message displayed');
        this.service.add({ severity: 'success', summary: 'Success Message', detail: 'Message sent' });
    }
toggleSkills = [
  { label: 'Java', model: 'option1' },
  { label: 'Angular', model: 'option2' },
  { label: 'Springboot', model: 'option3' },
  { label: 'Devops', model: 'option4' },
  { label: 'Python', model: 'option5' },
  { label: 'Machine Learning', model: 'option6' },
  { label: 'SQL', model: 'option7' },
  { label: 'Javascript', model: 'option8' },
  { label: 'Node JS', model: 'option9' },
  { label: 'Docker', model: 'option10' }
];



  activeStep: number = 1;

    name: string | undefined = '';

    email: string | undefined = '';

    password: string | undefined = '';

    option1: boolean | undefined = false;

    option2: boolean | undefined = false;

    option3: boolean | undefined = false;

    option4: boolean | undefined = false;

    option5: boolean | undefined = false;

    option6: boolean | undefined = false;

    option7: boolean | undefined = false;

    option8: boolean | undefined = false;

    option9: boolean | undefined = false;

    option10: boolean | undefined = false;




  // Data Properties
  display: boolean = false;
  jobs: Job[] = [];
  jobs2: Job[] = [];
  filteredJobs: Job[] = [];
  paginatedJobs: Job[] = [];
  dropdownValues = [
        { name: 'ACTIA ES' },
        { name: 'CIPI ACTIA' },
        { name: 'ACTIA AFRICA' },
        { name: 'ACTIA Paris' }
    ];


dropdownValuesJob = [
  {name:"Full-time",value:'FULL_TIME'  },
  {name:"Part-time",value:'PART_TIME'  },
  {name:"Internship",value:'INTERNSHIP'  },
  {name:"Remote",value:'REMOTE'  },
  {name:"Contract",value:'CONTRACT'  },];

    dropdownValuesSalary = [
        { name: '1700Dt - 2000Dt' },
        { name: '2000Dt - 2300Dt' },
        { name: '2500Dt - 3000Dt' },
        { name: '3500Dt - 4000Dt' }
    ];

  // Filter Properties
  searchQuery: string = '';
  selectedLocation: string = '';
  selectedJobType: string = '';
  selectedExperience: string = '';
  selectedSkills: string[] = [];
  selectedSort: string = 'recent';
  
  // Pagination Properties
  first: number = 0;
  itemsPerPage: number = 6;
  
  // UI Properties
  loading: boolean = true;
  lastUpdated: Date = new Date();
  
  // Filter Options
  filterOptions: FilterOptions = {
    locations: [
      { label: 'New York, NY', value: 'new-york' },
      { label: 'San Francisco, CA', value: 'san-francisco' },
      { label: 'London, UK', value: 'london' },
      { label: 'Toronto, Canada', value: 'toronto' },
      { label: 'Remote', value: 'remote' },
      { label: 'Berlin, Germany', value: 'berlin' }
    ],
    jobTypes: [
      { label: 'Contrat CDI', value: 'CDI' },
      { label: 'Alternance', value: 'ALTERNANCE' },
      { label: 'Stage PFE', value: 'STAGE_PFE' },
      { label: 'Stage d\'été', value: 'STAGE_ETE' }
    ],
    experienceLevels: [
      { label: 'Entry Level', value: 'entry' },
      { label: 'Mid Level', value: 'mid' },
      { label: 'Senior Level', value: 'senior' },
      { label: 'Lead/Principal', value: 'lead' }
    ],
    skills: [
      { label: 'JavaScript', value: 'javascript' },
      { label: 'TypeScript', value: 'typescript' },
      { label: 'Angular', value: 'angular' },
      { label: 'React', value: 'react' },
      { label: 'Node.js', value: 'nodejs' },
      { label: 'Python', value: 'python' },
      { label: 'Java', value: 'java' },
      { label: 'AWS', value: 'aws' },
      { label: 'Docker', value: 'docker' },
      { label: 'Kubernetes', value: 'kubernetes' }
    ]
  };
  
  sortOptions = [
    { label: 'Most Recent', value: 'recent' },
    { label: 'Salary: High to Low', value: 'salary-desc' },
    { label: 'Salary: Low to High', value: 'salary-asc' },
    { label: 'Company A-Z', value: 'company-asc' },
    { label: 'Title A-Z', value: 'title-asc' }
  ];
  role:string [] = [];
  isAdmin: boolean = false;
  ngOnInit() {
      
        this.role = this.storageService.getUser().roles;
       
        if(this.role.includes('ROLE_ADMIN')){
        this.isAdmin = true;
        }
    this.loadJobs();
  }
updateRequirements() {
  this.form.skills = this.toggleSkills
    .filter(skill => (this as any)[skill.model])
    .map(skill => skill.label);
}

  loadJobs() {
    // Simulate API call
    /* this.jobService.getAllJobs().subscribe({
      next: (data) => {
        for (const job of data) {
          if (this.jobs.includes(job)) {
            console.log('Job already exists:', job);
          }
          else{
            this.jobs.push(job);
            console.log('Job added:', job);
          }}
      },
      error: (error) => {
        console.error('Error fetching jobs:', error);
        this.loading = false;
      }
    }) */
   /*  setTimeout(() => {
     // this.jobs = this.getMockJobs();
     this.jobs = this.getJobs(); 
     console.log(this.jobs);
      this.filteredJobs = [...this.jobs];
      this.updatePaginatedJobs();
      this.loading = false;
    }, 1500); */

this.loading = true;
  this.jobService.getAllJobs().subscribe({
    next: (data) => {
      // Convert string dates to Date objects and ensure proper data structure
      this.jobs = data.map((job:any) => ({
        ...job,
        postedDate: new Date(job.postedDate), // Convert string to Date
        skills: Array.isArray(job.skills) ? job.skills : [], // Ensure skills is an array
        requirements: Array.isArray(job.requirements) ? job.requirements : [] // Ensure requirements is an array
      }));
      
      this.filteredJobs = [...this.jobs];
      this.updatePaginatedJobs();
      this.loading = false;
      console.log('Jobs loaded successfully:', this.jobs);
    },
    error: (error) => {
      console.error('Error fetching jobs:', error);
      this.loading = false;
      // Fallback to mock data if API fails
      this.jobs = this.getMockJobs();
      this.filteredJobs = [...this.jobs];
      this.updatePaginatedJobs();
    }
  });
  }


  getJobs():Job[]{
    this.jobService.getAllJobs().subscribe({
      next: (data) => {
        for (const job of data) {
          if (this.jobs2.includes(job)===false) {
            this.jobs2.push(job);
            
          }
          else{
            
            console.log('Job already exists:', job);
          }}
      },
      error: (error) => {
        console.error('Error fetching jobs:', error);
        this.loading = false;
      }
  })
  return this.jobs2
}
  getMockJobs(): Job[] {
    return [
      {
        jobId: 1,
        title: 'Senior Frontend Developer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        jobType: 'CDI',
        experience: '5+ years',
        /* salary: '$120k - $150k', */
        description: 'We are looking for a passionate Senior Frontend Developer to join our dynamic team. You will be responsible for building scalable web applications using modern frameworks.',
        requirements: ['5+ years React experience', 'TypeScript proficiency', 'Team leadership'],
        skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'Node.js'],
        postedDate: new Date(2024, 5, 1),
        isUrgent: true
      },
      {
        jobId: 2,
        title: 'Full Stack Engineer',
        company: 'StartupXYZ',
        location: 'Remote',
        jobType: 'STAGE_PFE',
        experience: '3-5 years',
        /* salary: '$90k - $120k', */
        description: 'Join our fast-growing startup as a Full Stack Engineer. Work on cutting-edge projects and help shape the future of our platform.',
        requirements: ['Full stack development', 'API design', 'Database optimization'],
        skills: ['Angular', 'Node.js', 'Python', 'PostgreSQL', 'AWS'],
        postedDate: new Date(2024, 5, 5)
      },
      {
        jobId: 3,
        title: 'DevOps Engineer',
        company: 'CloudTech Solutions',
        location: 'New York, NY',
        jobType: 'CDI',
        experience: '4-6 years',
        /* salary: '$130k - $160k', */
        description: 'We need a skilled DevOps Engineer to manage our cloud infrastructure and improve our deployment processes.',
        requirements: ['AWS/Azure experience', 'Docker/Kubernetes', 'CI/CD pipelines'],
        skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Python'],
        postedDate: new Date(2024, 4, 28),
        isUrgent: true
      },
      {
        jobId: 4,
        title: 'UX/UI Designer',
        company: 'Design Studio Pro',
        location: 'London, UK',
        jobType: 'CDI',
        experience: '2-4 years',
       /*  salary: '£45k - £60k', */
        description: 'Creative UX/UI Designer wanted to work on innovative digital products. Must have a strong portfolio and user-centered design approach.',
        requirements: ['Strong portfolio', 'Figma/Sketch expertise', 'User research'],
        skills: ['Figma', 'Sketch', 'Adobe Creative Suite', 'Prototyping', 'User Research'],
        postedDate: new Date(2024, 5, 3)
      },
      {
        jobId: 5,
        title: 'Backend Developer',
        company: 'Enterprise Corp',
        location: 'Toronto, Canada',
        jobType: 'CDI',
        experience: '3-5 years',
        /* salary: 'CAD $85k - $110k', */
        description: 'Backend Developer position available for building robust server-side applications. Experience with microservices architecture preferred.',
        requirements: ['Java/Spring Boot', 'Microservices', 'Database design'],
        skills: ['Java', 'Spring Boot', 'MySQL', 'Redis', 'Kafka'],
        postedDate: new Date(2024, 5, 7)
      },
      {
        jobId: 6,
        title: 'Data Scientist',
        company: 'AI Innovations',
        location: 'Berlin, Germany',
        jobType: 'CDI',
        experience: '2-4 years',
        /* salary: '€70k - €90k', */
        description: 'Join our AI team as a Data Scientist. Work on machine learning models and help drive data-driven decision making.',
        requirements: ['Python/R', 'Machine Learning', 'Statistics'],
        skills: ['Python', 'TensorFlow', 'Pandas', 'SQL', 'Jupyter'],
        postedDate: new Date(2024, 5, 6)
      }
    ];
  }

  onSearchChange() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredJobs = this.jobs.filter(job => {
      const matchesSearch = !this.searchQuery || 
        job.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(this.searchQuery.toLowerCase()));

      const matchesLocation = !this.selectedLocation || 
        job.location.toLowerCase().includes(this.selectedLocation.toLowerCase());

      const matchesJobType = !this.selectedJobType || 
        job.jobType === this.selectedJobType;

      const matchesExperience = !this.selectedExperience || 
        this.matchesExperienceLevel(job.experience, this.selectedExperience);

      const matchesSkills = this.selectedSkills.length === 0 || 
        this.selectedSkills.some(skill => 
          job.skills.some(jobSkill => 
            jobSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );

      return matchesSearch && matchesLocation && matchesJobType && matchesExperience && matchesSkills;
    });

    this.applySorting();
    this.first = 0;
    this.updatePaginatedJobs();
  }

  matchesExperienceLevel(jobExperience: string, selectedLevel: string): boolean {
    const experience = jobExperience.toLowerCase();
    switch (selectedLevel) {
      case 'entry':
        return experience.includes('entry') || experience.includes('0-2') || experience.includes('junior');
      case 'mid':
        return experience.includes('mid') || experience.includes('2-5') || experience.includes('3-5');
      case 'senior':
        return experience.includes('senior') || experience.includes('5+') || experience.includes('4-6');
      case 'lead':
        return experience.includes('lead') || experience.includes('principal') || experience.includes('7+');
      default:
        return true;
    }
  }

  applySorting() {
  switch (this.selectedSort) {
    case 'recent':
      this.filteredJobs.sort((a, b) => {
        const dateA = a.postedDate instanceof Date ? a.postedDate.getTime() : new Date(a.postedDate).getTime();
        const dateB = b.postedDate instanceof Date ? b.postedDate.getTime() : new Date(b.postedDate).getTime();
        return dateB - dateA;
      });
      break;
    /* case 'salary-desc':
      this.filteredJobs.sort((a, b) => this.extractSalaryNumber(b.salary) - this.extractSalaryNumber(a.salary));
      break; */
    /* case 'salary-asc':
      this.filteredJobs.sort((a, b) => this.extractSalaryNumber(a.salary) - this.extractSalaryNumber(b.salary));
      break; */
    case 'company-asc':
      this.filteredJobs.sort((a, b) => a.company.localeCompare(b.company));
      break;
    case 'title-asc':
      this.filteredJobs.sort((a, b) => a.title.localeCompare(b.title));
      break;
  }
}

  extractSalaryNumber(salary: string): number {
    const numbers = salary.match(/\d+/g);
    return numbers ? parseInt(numbers[0]) : 0;
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedLocation = '';
    this.selectedJobType = '';
    this.selectedExperience = '';
    this.selectedSkills = [];
    this.selectedSort = 'recent';
    this.applyFilters();
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.itemsPerPage = event.rows;
    this.updatePaginatedJobs();
  }

  updatePaginatedJobs() {
    const start = this.first;
    const end = start + this.itemsPerPage;
    this.paginatedJobs = this.filteredJobs.slice(start, end);
  }

  trackByJobId(index: number, job: Job): number {
    return job.jobId;
  }

  getJobTypeSeverity(type: string): string {
    switch (type) {
      case 'CDI':
        return 'success';
      case 'STAGE_PFE':
        return 'info';
      case 'ALTERNANCE':
        return 'warning';
      case 'STAGE_ETE':
        return 'secondary';
      default:
        return 'info';
    }
  }

  getTimeAgo(date: Date | string): string {
  const now = new Date();
  const jobDate = date instanceof Date ? date : new Date(date);
  const diffTime = Math.abs(now.getTime() - jobDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    return '1 day ago';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  } else {
    const months = Math.floor(diffDays / 30);
    return months === 1 ? '1 month ago' : `${months} months ago`;
  }
}

deleteJob(job: Job) {
    console.log('Viewing job details for:', job.title);
    this.jobService.deleteJob(job.jobId).subscribe({
      next:(data=>{
        this.service.add({ severity: 'success', summary: 'Job Deleted', detail: 'Your job has been successfully deleted' });
      })
      ,
      error:(error=>{
        this.service.add({ severity: 'error', summary: 'Job Deleted', detail: 'There was an error deleting the job. Please try again.' });
      })
    })
    // Implement navigation to job details page
    // this.router.navigate(['/jobs', job.id]);
  }

  viewJobDetails(jobId: any) {

     this.router.navigate(['/app/job-details', jobId]);
   
    
    // Implement navigation to job details page
    // this.router.navigate(['/jobs', job.id]);
  }

  applyToJob(jobId: any) {
    //console.log('Applying to job:', job.title);

    // Implement job application logic
    this.router.navigate(['/app/jobapplication', jobId]);
  }



 onsubmit() {
  this.updateRequirements();
  this.job = this.form;
  this.job.jobType = this.form.jobType.value;
  this.job.location = this.form.location.name;
/*   this.job.salary = this.form.salaryRange.name; // Ensure requirements are up to date */
  console.log(this.job);
  this.jobService.addJob(this.job).subscribe({
    next: (response) => {
      this.service.add({ severity: 'success', summary: 'Job Added', detail: 'Your job has been successfully added!' });
      this.close(); // Close the dialog after successful submission
      this.form.clear();
      this.loadJobs(); // Reload jobs to reflect the new addition
      console.log('Job added successfully:', response);
    },
    error: (error) => {
      this.service.add({ severity: 'error', summary: 'Error', detail: 'There was an error adding the job. Please try again.' });
      console.error('Error adding job:', error);
    }
  }) 
} 


  open() {
        this.display = true;
    }
    close() {
        this.display = false;
    }

/* onSubmit(): void {
    const { username, password } = this.form;

    this.jobService.addJob(username, password).subscribe({
      next: data => {
        this.storageService.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.storageService.getUser().roles;
        //this.reloadPage();
        
        // test
        this.navigateAfterLogin();
        this.messageService.add({ severity: 'success', summary: 'Login success', detail: `Welcome ${username}` });
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.messageService.add({ severity: 'error', summary: 'Login failed!', detail: 'Check your credentials!' });
        this.isLoginFailed = true;
      }
    });
  } */

}