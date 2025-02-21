import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-donation',
  imports: [],
  templateUrl: './donation.component.html',
  styleUrl: './donation.component.scss'
})
export class DonationComponent implements OnInit {
  preencherForm: FormGroup;
  usuario: any = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.preencherForm = this.fb.group({
      nome: ['', Validators.required],
      sobrenome: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      valorDoacao: ['', [Validators.required, Validators.min(1)]],
      termoAceito: [false, Validators.requiredTrue]
    });
  }

  async ngOnInit() {
    try {
      this.usuario = await this.authService.getUserData();
    } catch (error) {
      console.error('Erro ao carregar os dados do usuário:', error);
    }
  }

  async verificarCadastro() {
    // Verifica se os dados essenciais já estão completos
    if (this.usuario && this.usuario.nome && this.usuario.sobrenome && this.usuario.cpf) {
      // Se os dados estiverem completos, abre a doação diretamente
      this.redirecionarParaDoacao();
    } else {
      // Caso contrário, abre o modal para preencher os dados
      this.abrirModalCadastro();
    }
  }

  // Função para abrir o modal de cadastro
  abrirModalCadastro() {
    Swal.fire({
      html: `
        <input id="nome" class="swal2-input" placeholder="Nome">
        <input id="sobrenome" class="swal2-input" placeholder="Sobrenome">
        <input id="cpf" class="swal2-input" placeholder="CPF (apenas números)" maxlength="11"><br>
        <label class="swal2-checkbox">
          <input type="checkbox" id="termoAceito"> Aceito os termos
        </label>
      `,
      showCancelButton: true,
      confirmButtonText: 'Salvar',
      preConfirm: () => {
        const nome = (document.getElementById('nome') as HTMLInputElement).value;
        const sobrenome = (document.getElementById('sobrenome') as HTMLInputElement).value;
        const cpf = (document.getElementById('cpf') as HTMLInputElement).value;
        const termoAceito = (document.getElementById('termoAceito') as HTMLInputElement).checked;

        if (!nome || !sobrenome || !cpf || !termoAceito) {
          Swal.showValidationMessage('Todos os campos são obrigatórios e o termo deve ser aceito.');
        }
        return { nome, sobrenome, cpf, termoAceito };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Salva os dados do usuário no Firebase
          await this.authService.saveUserData(result.value);
          this.usuario = { ...this.usuario, ...result.value };
          // Após salvar os dados, chama a função para redirecionar para a doação
          this.redirecionarParaDoacao();
        } catch (error) {
          Swal.fire('Erro', 'Não foi possível salvar os dados. Tente novamente.', 'error');
        }
      }
    });
  }

  // Função para abrir o modal de doação
  abrirModalDoacao() {
    Swal.fire({
      html: `
        <input id="valorDoacao" class="swal2-input" placeholder="Valor da doação (R$)">
        <button id="doarAgora" class="swal2-confirm swal2-styled">Doar Agora</button>
      `,
      showConfirmButton: false,
      didOpen: () => {
        document.getElementById('doarAgora')?.addEventListener('click', async () => {
          const valor = (document.getElementById('valorDoacao') as HTMLInputElement).value;
          
          if (!valor || parseFloat(valor) <= 0) {
            Swal.showValidationMessage('Digite um valor válido para doação.');
            return;
          }

          try {
            // Salva o valor da doação no Firebase
            await this.authService.saveDonationValue(parseFloat(valor));
            // Redireciona para o link de doação
            window.open('https://link.mercadopago.com.br/vaquinhamateus', '_blank');
            Swal.close();
          } catch (error) {
            Swal.fire('Erro', 'Não foi possível salvar o valor da doação. Tente novamente.', 'error');
          }
        });
      }
    });
  }

  // Função para redirecionar para o link de doação
  redirecionarParaDoacao() {
    window.open('https://link.mercadopago.com.br/vaquinhamateus', '_blank');
  }
}
