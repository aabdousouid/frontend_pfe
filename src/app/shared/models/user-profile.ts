export class UserProfile {
    profileId!:number;
    userId!:number;
    title!:string | null;
    phoneNumber!:string;
    address!:string;
    links!:string[];
    summary!:string;
    experienceYears!:number;
    skills?:string[];
    languages!:string[];
    certifications!:string[];
    education!: EducationHistoryItem[];
    cvFilePath!: string;
    workHistory!: WorkHistoryItem[]
}
 
export interface EducationHistoryItem {
  degree: string | null;
  school: string | null;
  duration: string;
}

export interface WorkHistoryItem {
  title: string | null;
  description: string | null;
  duration: string;
  company: string | null;
}
