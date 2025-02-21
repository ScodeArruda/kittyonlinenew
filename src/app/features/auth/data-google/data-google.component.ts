import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MaterialModule } from '../../../core/material/material.module';
import { CommonModule, NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-data-google',
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './data-google.component.html',
  styleUrl: './data-google.component.scss'
})
export class DataGoogleComponent {
  preencherForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router // Adicionando o Router para redirecionar após login
  ) {
    this.preencherForm = this.fb.group({
      nome: ['', Validators.required],
      sobrenome: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      termoAceito: [false, Validators.requiredTrue],
    });
  }

  async onSubmit() {
    if (this.preencherForm.invalid) {
      return;
    }

    const dados = this.preencherForm.value;

    try {
      // Salvar dados do usuário
      await this.authService.saveUserData(dados);

      // Realizar o login automático do usuário após salvar os dados
      const user = await this.authService.loginWithGoogle(); // Método fictício de login. Pode ser alterado conforme seu serviço de autenticação

      // Redirecionar para a tela de doação ou outra página
      this.router.navigate(['/doacao']); // Altere para o caminho desejado

    } catch (error) {
      console.error('Erro ao salvar os dados ou fazer login:', error);
    }
  }
}

