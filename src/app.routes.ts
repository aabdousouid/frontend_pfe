import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { AuthGuard } from './app/shared/guards/auth.guard';
import { JobListComponent } from './app/pages/jobs/jobList.component';
import { ProfileComponent } from './app/pages/user/profile.component';
import { ChatbotComponent } from './app/pages/chat/chatbot/chatbot.component';
import { JobApplicationComponent } from './app/pages/jobs/job-application/jobApplication.component';
import { AddProfileComponent } from './app/pages/user/addProfile.component';
import { ApplicationListComponent } from './app/pages/jobs/applications/applicationAdminList/applicationsList.component';
import { FeaturesWidget } from './app/pages/landing/components/featureswidget';
import { AdminGuard } from './app/shared/guards/admin.guard';
import { ApplicationDetailsComponent } from './app/pages/jobs/applications/applicationDetailsAdmin/applicationDetails.component';
import { ApplicationUserListComponent } from './app/pages/jobs/applications/applicationUserList/appilcationsUserList.component';
import { TableExpandableRowGroupDemo } from './app/pages/jobs/applications/test.component';
import { UserInterviewDetailsComponent } from './app/pages/jobs/interviews/user-interview-details/user-interview-details.component';
import { AdminDashboardComponent } from './app/pages/dashboard/admin-dashboard/admin-dashboard.component';
import { ComplaintsListAdminComponent } from './app/pages/complaints/complaints-list-admin/complaints-list-admin.component';
import { ComplaintsListUserComponent } from './app/pages/complaints/complaints-list-user/complaints-list-user.component';
import { JobDetailsComponent } from './app/pages/jobs/job-details/job-details.component';
import { ApplicationDetailsUserComponent } from './app/pages/jobs/applications/application-details-user/application-details-user.component';

export const appRoutes: Routes = [
    
    { 
        path: '', 
        component: Landing,
        
    },
    { 
        path: 'landing', 
        redirectTo: '', 
        pathMatch: 'full' 
    },
    
    // Auth routes (publicly accessible)
    { 
        path: 'auth', 
        loadChildren: () => import('./app/pages/auth/auth.routes') 
    },
    
    // Protected routes with AuthGuard
    {
        path: 'app',
        component: AppLayout,
        canActivate: [AuthGuard],
        children: [
            { path: '', component: Dashboard },
            { path: 'dashboard', component: Dashboard },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
            {path: 'jobs', component: JobListComponent },
            {path:'profile',component:ProfileComponent},
            {path:'addProfile',component:AddProfileComponent},
            {path:'chatbot',component:ChatbotComponent},
            {path:'jobapplication/:id',component:JobApplicationComponent},
            {path: 'applications/:id', component: ApplicationDetailsComponent },
            {path: 'userApplications/:id', component: ApplicationUserListComponent },
            {path:'applications',component:ApplicationListComponent,canActivate: [AdminGuard] },
            {path:'admindashboard',component:AdminDashboardComponent },
            {path:'complaints-admin',component:ComplaintsListAdminComponent,canActivate:[AdminGuard]},
            {path:'complaints-user',component:ComplaintsListUserComponent},
            {path:'job-details/:id',component:JobDetailsComponent},
            {path: 'applicationUserDetails/:id', component: ApplicationDetailsUserComponent },
            
            
        ]
    },
    
    // Error pages
    { 
        path: 'notfound', 
        component: Notfound 
    },
    
    // Wildcard route - should be last
    { 
        path: '**', 
        redirectTo: '/notfound' 
    }
    
    
];
