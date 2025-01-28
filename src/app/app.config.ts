import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http'; // Importe 'withFetch'
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideDatabase, getDatabase } from '@angular/fire/database'; // Importação do Realtime Database
import { provideFirestore, getFirestore } from '@angular/fire/firestore'; // Firestore, caso seja necessário
import { provideStorage, getStorage } from '@angular/fire/storage'; // Storage, caso precise de upload de arquivos
import { environment } from '../environments/environment';

// Configuração do Firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyC-IhkgIYkOhxu82ENpZamFZRQ9tKqluQc",
//   authDomain: "kitty-online-new.firebaseapp.com",
//   databaseURL: "https://kitty-online-new-default-rtdb.firebaseio.com",
//   projectId: "kitty-online-new",
//   storageBucket: "kitty-online-new.appspot.com", // Corrigido o domínio do bucket
//   messagingSenderId: "398376108532",
//   appId: "1:398376108532:web:970d19d3ecafd99b64b9a1"
// };

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()), // Configuração para usar 'fetch' no HttpClient

    // Firebase Providers
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)), // Inicializa o app Firebase
    provideAuth(() => getAuth()), // Configuração do Firebase Authentication
    provideDatabase(() => getDatabase()), // Configuração do Realtime Database
    provideFirestore(() => getFirestore()), // Configuração opcional do Firestore
    provideStorage(() => getStorage()), // Configuração opcional para Storage
  ],
};
