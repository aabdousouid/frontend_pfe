import { Application } from "./application";

export class Interview {
    interviewId!:number;
    applicationId!:any;
    scheduledDate!:Date;
    scheduledHour!:Date;
    location!:string;
    notes?:string;
    status!: 'SCHEDULED' | 'RESCHEDULED' | 'COMPLETED' | 'CANCELED' | 'CONFIRMED';
    interviewType!: 'REMOTE' | 'ONSITE' | 'ONPHONE';
    interviewTest!:'TECHNIQUE' | 'RH' ;
    interviewerEmail?: string;
    interviewerName?: string;
    meetingLink?: string;
    duration?:number;
}
