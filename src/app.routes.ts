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

export const appRoutes: Routes = [
    
    { 
        path: '', 
        component: Landing 
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
            {path:'jobapplication/:id',component:JobApplicationComponent}
            
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
