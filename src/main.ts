import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

// import { bootstrapApplication } from '@angular/platform-browser';
// import { provideRouter, Routes } from '@angular/router';
// import { provideHttpClient } from '@angular/common/http';
// import { importProvidersFrom } from '@angular/core';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { AngularFireModule } from '@angular/fire/compat';
// import { AngularFireAuthModule } from '@angular/fire/compat/auth';
// import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import { AppComponent } from './app/app.component';
// import { environment } from './environments/environment';
// import { DashComponent } from './app/features/auth/dash/dash.component';
// import { LoginComponent } from './app/features/auth/login/login.component';
// import { RegisterComponent } from './app/features/auth/register/register.component';
// import { AuthService } from './app/features/auth/auth.service';

// const routes: Routes = [
//   { path: '', component: DashComponent },
//   { path: 'login', component: LoginComponent },
//   { path: 'register', component: RegisterComponent },
//   { path: '**', redirectTo: '' },
// ];

// bootstrapApplication(AppComponent, {
//   providers: [
//     provideRouter(routes),
//     provideHttpClient(),
//     importProvidersFrom(
//       FormsModule,
//       ReactiveFormsModule,
//       BrowserAnimationsModule,
//       AngularFireModule.initializeApp(environment.firebaseConfig),
//       AngularFireAuthModule,
//       AngularFireDatabaseModule
//     ),
//     AuthService,
//   ],
// })
//   .then(() => console.log('Aplicação inicializada com sucesso!'))
//   .catch((err) => console.error('Erro ao inicializar a aplicação:', err));
