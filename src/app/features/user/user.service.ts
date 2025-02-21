// import { inject, Injectable } from '@angular/core';
// import { Auth } from '@angular/fire/auth';
// import { Router } from '@angular/router';
// import { updateProfile, deleteUser, signOut } from 'firebase/auth';
// import { Database, ref, set, get, remove } from 'firebase/database';
// import { BehaviorSubject, Observable, from } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class UserService {
//   constructor(private firebaseAuth: Auth, private router: Router) {}
//   private database = inject(Database);

//   private _isLoggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());
//   isLoggedIn$: Observable<boolean> = this._isLoggedIn.asObservable();

//   // Método para recuperar os dados do usuário
//   async getUserData(): Promise<any> {
//     const user = this.firebaseAuth.currentUser;
//     if (user) {
//       const userRef = ref(this.database, `users/${user.uid}`);
//       const snapshot = await get(userRef);
//       if (snapshot.exists()) {
//         return { ...snapshot.val(), uid: user.uid, email: user.email, displayName: user.displayName };
//       } else {
//         console.log('Dados não encontrados no Realtime Database!');
//         return null;
//       }
//     } else {
//       throw new Error('Usuário não autenticado');
//     }
//   }

//   // Método para editar os dados do usuário
//   async updateUserData(dados: any): Promise<void> {
//     const user = this.firebaseAuth.currentUser;
//     if (user) {
//       // Atualiza o perfil do usuário no Firebase Authentication
//       await updateProfile(user, {
//         displayName: `${dados.nome} ${dados.sobrenome}`,
//       });

//       // Atualiza os dados do usuário no Firebase Realtime Database
//       const userRef = ref(this.database, `users/${user.uid}`);
//       await set(userRef, {
//         nome: dados.nome,
//         sobrenome: dados.sobrenome,
//         email: dados.email,
//         cpf: dados.cpf,
//         termoAceito: dados.termoAceito,
//       });
//     } else {
//       throw new Error('Usuário não autenticado');
//     }
//   }

//   // Método para deletar a conta do usuário
//   async deleteUserAccount(): Promise<void> {
//     const user = this.firebaseAuth.currentUser;
//     if (user) {
//       // Exclui os dados do usuário do Firebase Realtime Database
//       const userRef = ref(this.database, `users/${user.uid}`);
//       await remove(userRef);

//       // Exclui a conta do usuário no Firebase Authentication
//       await deleteUser(user);

//       // Limpa o token de autenticação e altera o estado de login
//       localStorage.removeItem('authToken');
//       this._isLoggedIn.next(false);

//       // Redireciona para a tela de login após excluir a conta
//       this.router.navigate(['/login']);
//     } else {
//       throw new Error('Usuário não autenticado');
//     }
//   }

//   // Método de logout
//   logout(): Observable<void> {
//     const promise = signOut(this.firebaseAuth).then(() => {
//       localStorage.removeItem('authToken');
//       this._isLoggedIn.next(false);
//       this.router.navigate(['/login']);
//     });
//     return from(promise);
//   }

//   // Verifica se o usuário está logado
//   isLoggedIn(): boolean {
//     return !!localStorage.getItem('authToken');
//   }
// }
