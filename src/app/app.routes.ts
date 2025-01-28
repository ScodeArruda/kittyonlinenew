import { RouterModule, Routes } from '@angular/router';
import { DashComponent } from './features/auth/dash/dash.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { NgModule } from '@angular/core';
import { TermoComponent } from './features/auth/termo/termo.component';
import { HomeComponent } from './features/auth/home/home.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dash',
        pathMatch: 'full'
    },
    {
        path: 'dash',
        component: DashComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'termo',
        component: TermoComponent
    },
    {
        path: 'home',
        component: HomeComponent
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
