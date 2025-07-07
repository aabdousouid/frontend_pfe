import { Routes } from '@angular/router';
import { Access } from './access';
import { Login } from './login';
import { Error } from './error';
import { Register } from './register';
import { Landing } from '../landing/landing';

export default [{
    path:'',
    children:[
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'login', component: Login },
    {path:'register',component:Register},
]
}
] as Routes;
