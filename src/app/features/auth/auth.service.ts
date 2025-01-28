import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from '@angular/fire/auth';
import { Database, ref, set } from '@angular/fire/database'; // Importando métodos do Realtime Database
import { Router } from '@angular/router';
import { from, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth = inject(Auth);
  database = inject(Database); // Realtime Database
  router = inject(Router);

  private _isLoggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());
  isLoggedIn$: Observable<boolean> = this._isLoggedIn.asObservable();

  // Método de registro
  async register(dados: any): Promise<void> {
    try {
      // Cria o usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        this.firebaseAuth,
        dados.email,
        dados.password
      );

      // Atualiza o perfil do usuário no Firebase Auth
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: `${dados.nome} ${dados.sobrenome}`,
        });

        // Salva os dados adicionais no Realtime Database
        const userRef = ref(this.database, `users/${userCredential.user.uid}`);
        await set(userRef, {
          nome: dados.nome,
          sobrenome: dados.sobrenome,
          email: dados.email,
          cpf: dados.cpf,
          termoAceito: dados.termoAceito,
        });

        console.log('Usuário registrado com sucesso no Realtime Database!');

        // Realiza login automático após o registro
        await this.login(dados.email, dados.password); // Reutilizando o método de login após o registro

        // Após o login, o usuário já estará autenticado e podemos redirecionar
        this.router.navigate(['/home']);
      }
    } catch (error) {
      console.error('Erro ao registrar ou fazer login no Firebase:', error);
      throw error; // Tratamento de erro
    }
  }

  // Método de login com Google
  async loginWithGoogle(): Promise<void> {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.firebaseAuth, provider);
      const user = result.user;

      // Verifica se o usuário é novo
      if (user.metadata.creationTime === user.metadata.lastSignInTime) {
        // Se for novo, solicitar dados adicionais (CPF, nome, sobrenome)
        this.router.navigate(['/preencher-dados']);
      } else {
        // Se não for novo, redirecionar diretamente para o home
        this.router.navigate(['/home']);
      }

      // Salva o token de autenticação no localStorage
      localStorage.setItem('authToken', user.refreshToken);
      this._isLoggedIn.next(true);
    } catch (error) {
      console.error('Erro ao fazer login com Google:', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<void> {
    const userCredential = await signInWithEmailAndPassword(this.firebaseAuth, email, password);
    if (userCredential.user) {
      // Salva o token de autenticação no localStorage (opcional)
      localStorage.setItem('authToken', userCredential.user.refreshToken);
      this._isLoggedIn.next(true);
    }
  }

  // Método para salvar dados adicionais no Firebase Realtime Database
  async saveUserData(dados: any): Promise<void> {
    try {
      const user = this.firebaseAuth.currentUser;
      if (user) {
        const userRef = ref(this.database, `users/${user.uid}`);
        await set(userRef, {
          nome: dados.nome,
          sobrenome: dados.sobrenome,
          cpf: dados.cpf,
          email: user.email,
          termoAceito: dados.termoAceito,
        });
        console.log('Dados adicionais salvos no Realtime Database!');
        this.router.navigate(['/home']);
      }
    } catch (error) {
      console.error('Erro ao salvar dados no Realtime Database:', error);
      throw error;
    }
  }

  // Método de logout
  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth).then(() => {
      localStorage.removeItem('authToken');
      this._isLoggedIn.next(false);
      this.router.navigate(['/login']);
    });
    return from(promise);
  }

  // Verifica se o usuário está logado
  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }
}
