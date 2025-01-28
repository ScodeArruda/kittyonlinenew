import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from '@angular/fire/auth';
import { Database, ref, set } from '@angular/fire/database'; // Importando métodos do Realtime Database
import { Router } from '@angular/router';
import { from, Observable, BehaviorSubject } from 'rxjs';

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
      }
    } catch (error) {
      console.error('Erro ao registrar usuário no Firebase:', error);
      throw error;
    }
  }

  // Método de login
  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password)
      .then((userCredential) => {
        localStorage.setItem('authToken', userCredential.user.refreshToken);
        this._isLoggedIn.next(true);
      });
    return from(promise);
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