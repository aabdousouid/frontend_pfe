import { Component, OnInit } from '@angular/core';
import { NotificationsWidget } from './components/notificationswidget';
import { StatsWidget } from './components/statswidget';
import { RecentSalesWidget } from './components/recentsaleswidget';
import { BestSellingWidget } from './components/bestsellingwidget';
import { RevenueStreamWidget } from './components/revenuestreamwidget';
import { DashboardStatsResponse, DashboardstatsService } from '../../shared/services/dashboardstats.service';
import { InterviewService, UpcomingInterview } from '../../shared/services/interview.service';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { WebsocketService } from '../../shared/services/websocket.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { NotificationService } from '../../shared/services/notification.service';


export interface StatCard {
  label: string;
  value: string | number;
  icon: string;
  iconBgClass: string;
  iconColorClass: string;
  highlight: string;
  subtext: string;
}

@Component({
    selector: 'app-dashboard',
    imports: [StatsWidget, RecentSalesWidget, BestSellingWidget, ProgressSpinnerModule,RevenueStreamWidget, NotificationsWidget,CommonModule,ToastModule],
    template: `
        <div class="grid grid-cols-12 gap-8">
            <app-stats-widget class="contents" [stats]="statsData"/>
            <div class="col-span-12 xl:col-span-6">
                <app-recent-sales-widget [interviews]="upcomingInterviews" *ngIf="!loadingInterviews"></app-recent-sales-widget>
                <p-progress-spinner *ngIf="loadingInterviews" ariaLabel="loading" strokeWidth="8" fill="transparent" animationDuration=".5s" [style]="{ width: '50px', height: '50px' }"/>

                <app-best-selling-widget />
            </div>
            <div class="col-span-12 xl:col-span-6">
                <app-revenue-stream-widget />
                <app-notifications-widget  />
            </div>
        </div>
      
  
    `,
    providers:[MessageService]
})
export class Dashboard implements OnInit {
  statsData: StatCard[] = [];
  loading = true;
  upcomingInterviews: UpcomingInterview[] = [];
  loadingInterviews = true;
 

constructor(private notificationService:NotificationService,private statsService: DashboardstatsService,private interviewService: InterviewService,private wsService:WebsocketService,private messageService:MessageService) {}


  ngOnInit(): void {
   
    this.interviewService.getUpcomingInterviews().subscribe((data) => {
      this.upcomingInterviews = data;
      this.loadingInterviews = false;
    });


    this.statsService.getStats().subscribe((stats: DashboardStatsResponse) => {
      this.statsData = [
        {
          label: 'Candidatures',
          value: stats.applications,
          icon: 'pi pi-inbox',
          iconBgClass: 'bg-blue-100 dark:bg-blue-400/10',
          iconColorClass: 'text-blue-500',
          highlight: `${stats.newApplications} new`,
          subtext: 'today'
        },
        {
          label: 'Entretiens réalisés',
          value: stats.interviewsConducted,
          icon: 'pi pi-clock',
          iconBgClass: 'bg-orange-100 dark:bg-orange-400/10',
          iconColorClass: 'text-orange-500',
          highlight: `${stats.interviewsThisWeek} this week`,
          subtext: ''
        },
        {
          label: 'Nouvelles offres d\'emploi',
          value: stats.newJobPostings,
          icon: 'pi pi-briefcase',
          iconBgClass: 'bg-green-100 dark:bg-green-400/10',
          iconColorClass: 'text-green-500',
          highlight: `${stats.jobPostingsToday} today`,
          subtext: ''
        },
        {
          label: 'Taux d\'acceptation des offres',
          value: stats.offerAcceptanceRate.toFixed(1) + '%',
          icon: 'pi pi-check-circle',
          iconBgClass: 'bg-purple-100 dark:bg-purple-400/10',
          iconColorClass: 'text-purple-500',
          highlight: '', // You can add trend here if your backend sends it
          subtext: ''
        }
      ];
      this.loading = false;
    });
    
    }
    

}
