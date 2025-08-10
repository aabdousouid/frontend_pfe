export interface Notification {
    notificationId: number;
    recipient: any;

    message:string;
    type: 'APPLICATION_SUBMITTED' | 'APPLICATION_STATUS_CHANGED' | 'INTERVIEW_SCHEDULED' | 'GENERAL';
    createdAt:Date;
    isRead:boolean;
}