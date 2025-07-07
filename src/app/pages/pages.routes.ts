import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { JobListComponent } from './jobs/jobList.component';
import { ProfileComponent } from './user/profile.component';
import { AddProfileComponent } from './user/addProfile.component';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' },
    {path:'jobs',component:JobListComponent},
    {path:'profile',component:ProfileComponent},
    {path:'addProfile',component:AddProfileComponent}
] as Routes;
