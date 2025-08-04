import { Application } from "./application";

export class QuizResult {
    id!:number;
    score!:number;
    status!:string;
    matchScore!:number;
    application!:Application;
    submittedAt!:Date;
}
