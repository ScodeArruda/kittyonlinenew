import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { FirebaseError } from 'firebase/app';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dados-user',
  standalone: true,
  imports: [FormsModule, CommonModule, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './dados-user.component.html',
  styleUrls: ['./dados-user.component.scss']
})
export class DadosUserComponent {
  public userData: any = { cpf: '' };
  public isEditing: boolean = false;
  public editData: any = {};
  public emailUsuario: string | null = null;
  public isGoogleLogin: boolean = false;

  constructor(private _userData: AuthService, private router: Router) { }

  async ngOnInit(): Promise<void> {
    try {
      // Aguardar a autenticação ser restaurada (se necessário)
      const user = await this.waitForUserAuthState();
  
      if (user) {
        // O usuário está autenticado
        this.userData = await this._userData.getUserData();
        // console.log('Dados do usuário:', this.userData);
        this.emailUsuario = this._userData.getUserEmail();
        this.editData = { ...this.userData };
  
        // Verifica se o login foi via Google
        this.isGoogleLogin = user.providerData.some((provider: { providerId: string; }) => provider.providerId === 'google.com');
      } else {
        // Se o usuário não está autenticado, redireciona para o login
        console.log('Usuário não autenticado');
        this.router.navigate(['/login']); // Descomente para redirecionar, se necessário
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      Swal.fire('Erro!', 'Não foi possível carregar seus dados. Tente novamente.', 'error');
    }
  }
  
  // Método para aguardar a restauração do estado de autenticação do Firebase
  private waitForUserAuthState(): Promise<any> {
    return new Promise((resolve, reject) => {
      const unsubscribe = this._userData.firebaseAuth.onAuthStateChanged(user => {
        if (user) {
          resolve(user); // Se o usuário estiver autenticado, resolve com o usuário
        } else {
          resolve(null); // Se o usuário não estiver autenticado, resolve com null
        }
        unsubscribe(); // Interrompe o listener após a resposta
      }, reject); // Em caso de erro, rejeita
    });
  }    

  async loadUserData() {
    try {
      const isLoggedIn = await this._userData.isLoggedIn();
      console.log('Está logado?', isLoggedIn); // Verifique o estado de login
      if (isLoggedIn) {
        const userData = await this._userData.getUserData();
        console.log('Dados do usuário:', userData); // Verifique os dados
        this.userData = userData || {}; 
        this.editData = { ...this.userData };
      } else {
        Swal.fire('Erro!', 'Você precisa estar autenticado para acessar seus dados.', 'error');
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      Swal.fire('Erro!', 'Não foi possível carregar seus dados, faça login novamente.', 'error');
    }
  }

  openEditModal() {
    this.isEditing = true;
  }

  closeEditModal() {
    this.isEditing = false;
  }

  async updateUser() {
    try {
      await this._userData.updateUserData(this.editData);
      this.userData = { ...this.editData };  // Update user data on success
      this.closeEditModal();
      Swal.fire('Sucesso!', 'Seus dados foram atualizados.', 'success');
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
      Swal.fire('Erro!', 'Não foi possível atualizar seus dados.', 'error');
    }
  }

  openDeleteModal() {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Essa ação não pode ser desfeita.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Deletar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteUser();
      }
    });
  }

  async deleteUser() {
    try {
      const { value: password } = await Swal.fire({
        title: 'Confirme sua senha',
        input: 'password',
        inputLabel: 'Digite sua senha para confirmar',
        inputPlaceholder: 'Senha',
        inputAttributes: {
          maxlength: '20',
          autocapitalize: 'off',
          autocorrect: 'off',
        },
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
      });

      if (password) {
        // Reautentica o usuário antes de deletar a conta
        await this._userData.reauthenticateUser(password);

        // Deleta a conta
        await this._userData.deleteUserAccount();

        // Exibe mensagem de sucesso
        Swal.fire('Deletado!', 'Sua conta foi deletada com sucesso.', 'success');

        // Desloga e recarrega
        this._userData.logout().subscribe(() => {
          window.location.reload();
        });
      }
    } catch (error) {
      console.error('Erro ao deletar conta:', error);

      // Verifique se o erro é uma instância de `FirebaseError`
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/wrong-password') {
          Swal.fire('Erro!', 'Senha incorreta. Tente novamente.', 'error');
        } else if (error.code === 'auth/requires-recent-login') {
          Swal.fire(
            'Erro!',
            'Você precisa fazer login novamente para confirmar esta ação.',
            'error'
          );
        } else {
          Swal.fire('Erro!', 'Não foi possível deletar sua conta.', 'error');
        }
      } else {
        Swal.fire('Erro!', 'Algo deu errado. Tente novamente mais tarde.', 'error');
      }
    }
  }

}