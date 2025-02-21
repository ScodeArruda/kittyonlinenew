import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DadosUserComponent } from './dados-user/dados-user.component';
import { MidiasComponent } from './midias/midias.component';
import { DonationComponent } from './donation/donation.component';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, DadosUserComponent, MidiasComponent, DonationComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  activeTab: string = 'campaign';
  saudacao: string = '';
  usuario: any = null;
  menuAberto: boolean = false;

  constructor(private _authService: AuthService) { }

  async ngOnInit() {
    try {
          // Aguardar a autenticação ser restaurada (se necessário)
          const user = await this.waitForUserAuthState();
      
          if (user) {
            // O usuário está autenticado
            this.usuario = await this._authService.getUserData();
            this.saudacao = this.calcularSaudacao();
          } else {
            // Se o usuário não está autenticado, redireciona para o login
            console.log('Usuário não autenticado');
          }
        } catch (error) {
          console.error('Erro ao carregar dados do usuário:', error);
          Swal.fire('Erro!', 'Não foi possível carregar seus dados. Tente novamente.', 'error');
        }
  }

   // Método para aguardar a restauração do estado de autenticação do Firebase
   private waitForUserAuthState(): Promise<any> {
    return new Promise((resolve, reject) => {
      const unsubscribe = this._authService.firebaseAuth.onAuthStateChanged(user => {
        if (user) {
          resolve(user); // Se o usuário estiver autenticado, resolve com o usuário
        } else {
          resolve(null); // Se o usuário não estiver autenticado, resolve com null
        }
        unsubscribe(); // Interrompe o listener após a resposta
      }, reject); // Em caso de erro, rejeita
    });
  }

  // Função para calcular a saudação com base no horário
  calcularSaudacao(): string {
    const hora = new Date().getHours(); // Obtém a hora atual
    let saudacao = '';

    if (hora >= 5 && hora < 12) {
      saudacao = 'Bom dia';
    } else if (hora >= 12 && hora < 18) {
      saudacao = 'Boa tarde';
    } else {
      saudacao = 'Boa noite';
    }

    // Personaliza a saudação com o nome do usuário
    return `${saudacao}, ${this.usuario ? this.usuario?.nome : 'Visitante'}.`;
  }
  

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  _logout() {
    this._authService.logout().subscribe({
      next: () => {
        console.log('Usuário deslogado com sucesso!');
      },
      error: (err: any) => {
        console.error('Erro ao deslogar:', err);
      },
    });
  }
}
