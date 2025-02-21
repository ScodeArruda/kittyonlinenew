import { RouterModule, Routes } from '@angular/router';
import { DashComponent } from './features/auth/dash/dash.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { NgModule } from '@angular/core';
import { TermoComponent } from './features/auth/termo/termo.component';
import { HomeComponent } from './features/auth/home/home.component';
import { AuthGuard } from './core/guards/auth.guard';
import { DataGoogleComponent } from './features/auth/data-google/data-google.component';
import { MidiasComponent } from './features/auth/home/midias/midias.component';
import { DonationComponent } from './features/auth/home/donation/donation.component';

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
    // {
    //     path: 'data-google',
    //     component: DataGoogleComponent,
    // },
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'campaign',
        component: MidiasComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'donation',
        component: DonationComponent,
        canActivate: [AuthGuard]
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
