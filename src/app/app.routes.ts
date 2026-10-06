import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Login } from './dashboard/login/login';
import { Dashboard } from './dashboard/dashboard';
import { Overview } from './dashboard/overview/overview';
import { ManageProfile } from './dashboard/manage-profile/manage-profile';
import { ManageProjects } from './dashboard/manage-projects/manage-projects';
import { ManageSkills } from './dashboard/manage-skills/manage-skills';
import { ManageExperience } from './dashboard/manage-experience/manage-experience';
import { Messages } from './dashboard/messages/messages';
import { Notfound } from './shared/notfound/notfound';

export const routes: Routes = [

    {path:'',component:Layout},

    {path:'login',component:Login},

    {path:'dashboard',component:Dashboard,children:[
        {path:'',redirectTo:'overview',pathMatch:'full'},
        {path:'overview',component:Overview},
        {path:'manage-profile',component:ManageProfile},
        {path:'manage-projects',component:ManageProjects},
        {path:'manage-skills',component:ManageSkills},
        {path:'manage-experience',component:ManageExperience},
        {path:'messages',component:Messages},
    ]},
    {path:'**',component:Notfound},
];