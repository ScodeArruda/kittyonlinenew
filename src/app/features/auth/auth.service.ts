import { Injectable, inject } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  deleteUser, EmailAuthProvider,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from '@angular/fire/auth';
import { Database, get, ref, remove, set } from '@angular/fire/database';
import { Router } from '@angular/router';
import { from, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  firebaseAuth = inject(Auth);
  database = inject(Database);
  router = inject(Router);

  constructor() {
    // Configura a persistência da autenticação manualmente via localStorage
    this.setLocalStoragePersistence();
    // Verifica o estado de autenticação ao inicializar a aplicação
    this.checkAuthState();
  }

  private setLocalStoragePersistence() {
    try {
      // Verifica se o usuário já está logado e armazena o token no localStorage
      const user = this.firebaseAuth.currentUser;
      if (user) {
        localStorage.setItem('authToken', user.refreshToken); // Salva o token de autenticação no localStorage
        console.log('Persistência configurada usando localStorage');
      }
    } catch (error) {
      console.error('Erro ao configurar persistência:', error);
    }
  }

  private checkAuthState() {
    // Verifica o estado de autenticação com onAuthStateChanged
    this.firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        // Usuário está autenticado, salva o token no localStorage
        localStorage.setItem('authToken', user.refreshToken);
        this._isLoggedIn.next(true);
      } else {
        // Usuário não autenticado, remove o token
        localStorage.removeItem('authToken');
        this._isLoggedIn.next(false);
      }
    });
  }


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

  async loginWithGoogle(): Promise<void> {
    try {
      // Inicializa o provedor do Google
      const provider = new GoogleAuthProvider();

      // Faz o login usando o popup do Google
      const result = await signInWithPopup(this.firebaseAuth, provider);
      const user = result.user;

      // Redireciona para a home após o login bem-sucedido
      this.router.navigate(['/home']);

      // Salva o token de autenticação no localStorage
      localStorage.setItem('authToken', user.refreshToken);

      // Atualiza o status de login
      this._isLoggedIn.next(true);

    } catch (error) {
      console.error('Erro ao fazer login com Google:', error);
      throw error;
    }
  }


  // Método de login com Google
  // async loginWithGoogle(): Promise<void> {
  //   try {
  //     const provider = new GoogleAuthProvider();
  //     const result = await signInWithPopup(this.firebaseAuth, provider);
  //     const user = result.user;

  //     // Verifica se o usuário é novo
  //     if (user.metadata.creationTime === user.metadata.lastSignInTime) {
  //       // Se for novo, solicitar dados adicionais (CPF, nome, sobrenome)
  //       this.router.navigate(['/data-google']);
  //     } else {
  //       // Se não for novo, verifique se os dados estão no Realtime Database
  //       const userData = await this.getUserData();
  //       if (!userData) {
  //         // Caso não haja dados no Realtime Database, navegar para tela de cadastro
  //         this.router.navigate(['/data-google']);
  //       } else {
  //         this.router.navigate(['/home']);
  //       }
  //     }

  //     // Salva o token de autenticação no localStorage
  //     localStorage.setItem('authToken', user.refreshToken);
  //     this._isLoggedIn.next(true);
  //   } catch (error) {
  //     console.error('Erro ao fazer login com Google:', error);
  //     throw error;
  //   }
  // }

  getUserEmail(): string | null {
    return this.firebaseAuth.currentUser?.email ?? null;
  }

  async login(email: string, password: string): Promise<void> {
    const userCredential = await signInWithEmailAndPassword(this.firebaseAuth, email, password);
    if (userCredential.user) {
      // Salva o token de autenticação no localStorage (opcional)
      localStorage.setItem('authToken', userCredential.user.refreshToken);
      this._isLoggedIn.next(true);
    }
  }

  async getUserData(): Promise<any> {
    const user = this.firebaseAuth.currentUser;
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    try {
      const userRef = ref(this.database, `users/${user.uid}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        return snapshot.val(); // Retorna os dados se existirem
      } else {
        console.warn('Dados não encontrados no Realtime Database!');
        return {}; // Retorna um objeto vazio caso não haja dados
      }
    } catch (error) {
      console.error('Erro ao acessar os dados do usuário no Firebase:', error);
      throw new Error('Erro ao recuperar os dados do usuário');
    }
  }

  async saveDonationValue(valor: number): Promise<void> {
    try {
      const user = this.firebaseAuth.currentUser;
      if (user) {
        const userRef = ref(this.database, `users/${user.uid}/valorDoacao`);
        await set(userRef, valor);
        console.log('Valor da doação salvo no Realtime Database!');
      }
    } catch (error) {
      console.error('Erro ao salvar o valor da doação no Firebase:', error);
      throw error;
    }
  }


  // Salva os dados adicionais no Firebase Realtime Database
  async saveUserData(dados: any): Promise<void> {
    try {
      const user = this.firebaseAuth.currentUser;
      if (user) {
        const userRef = ref(this.database, `users/${user.uid}`);
        await set(userRef, {
          uid: user.uid,  // Salva o UID do Google para referência
          nome: dados.nome,
          sobrenome: dados.sobrenome,
          cpf: dados.cpf,
          email: user.email,
          termoAceito: dados.termoAceito
        });
        console.log('Dados adicionais salvos no Realtime Database!');
      }
    } catch (error) {
      console.error('Erro ao salvar dados no Realtime Database:', error);
      throw error;
    }
  }

  // Método para editar os dados do usuário
  async updateUserData(dados: any): Promise<void> {
    const user = this.firebaseAuth.currentUser;
    if (user) {
      // Atualiza o perfil do usuário no Firebase Authentication
      await updateProfile(user, {
        displayName: `${dados.nome} ${dados.sobrenome}`,
      });

      // Atualiza os dados do usuário no Firebase Realtime Database
      const userRef = ref(this.database, `users/${user.uid}`);
      await set(userRef, {
        nome: dados.nome,
        sobrenome: dados.sobrenome,
        email: dados.email,
        cpf: dados.cpf,
        termoAceito: dados.termoAceito,
      });
    } else {
      throw new Error('Usuário não autenticado');
    }
  }

  // Método para deletar a conta do usuário
  async deleteUserAccount(): Promise<void> {
    const user = this.firebaseAuth.currentUser;
    if (user) {
      // Exclui os dados do usuário do Firebase Realtime Database
      const userRef = ref(this.database, `users/${user.uid}`);
      await remove(userRef);

      // Exclui a conta do usuário no Firebase Authentication
      await deleteUser(user);

      // Limpa o token de autenticação e altera o estado de login
      localStorage.removeItem('authToken');
      this._isLoggedIn.next(false);

      // Redireciona para a tela de login após excluir a conta
      this.router.navigate(['/dash']);
    } else {
      throw new Error('Usuário não autenticado');
    }
  }

  async reauthenticateUser(password: string): Promise<void> {
    const user = this.firebaseAuth.currentUser;
    if (user) {
      const credential = EmailAuthProvider.credential(user.email || '', password);
      await reauthenticateWithCredential(user, credential);
    } else {
      throw new Error('Usuário não autenticado');
    }
  }

  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth).then(() => {
      localStorage.removeItem('authToken'); // Remove token de autenticação
      this._isLoggedIn.next(false); // Atualiza o estado de login
      this.router.navigate(['/dash']); // Redireciona para login
    });
    return from(promise);
  }

  // Método para verificar se o usuário está autenticado com persistência
  isLoggedIn(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;  // Verifica se o token existe no localStorage
  }

}