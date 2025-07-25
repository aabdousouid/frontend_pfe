export class Job {
  jobId!: number;
  title!: string;
  company!: string;
  description!: string;
  location!: string;
  jobType!: 'CDI' | 'STAGE_PFE' | 'STAGE_ETE' | 'ALTERNANCE';
  experience!: string;
  /* salary!: string; */
  
  requirements!: string[];
  skills!: string[];
  postedDate!: Date;
  isUrgent?: boolean;
  companyLogo?: string;
  isActive?:boolean;
}
