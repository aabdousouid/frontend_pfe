export class Job {
  jobId!: number;
  title!: string;
  company!: string;
  description!: string;
  location!: string;
  jobType!: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  experience!: string;
  salary!: string;
  
  requirements!: string[];
  skills!: string[];
  postedDate!: Date;
  isUrgent?: boolean;
  companyLogo?: string;
  isActive?:boolean;
}
