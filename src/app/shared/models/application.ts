export class Application {

    applicationId!:number;
    user:any;
    job:any; 
    appliedDate!:Date;
    status!: 'PENDING' | 'APPROVED' | 'REJECTED' | 'INTERVIEW' |'HIRED';
    adminComments?:string[];
    lastUpdated?:Date;
    interviews?:any[];
    cvFileName?:string;
    extractedSkills?:string[];
    cvSummary?:string;
}
