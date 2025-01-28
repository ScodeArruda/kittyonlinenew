import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { AuthService } from '../auth.service'; // Importação do serviço de autenticação

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, // Injetando o AuthService
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nome: ['', Validators.required],
      sobrenome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]], // CPF sem máscara
      password: ['', [Validators.required, Validators.minLength(6)]],
      termoAceito: [false, Validators.requiredTrue],
    });
  }

  async registerUser() {
    console.log('Formulário válido:', this.registerForm.valid);
    console.log('Erros do formulário:', this.registerForm.errors);
  
    if (this.registerForm.invalid) {
      console.warn('Formulário inválido. Verifique os dados.');
      return;
    }
  
    this.isSubmitting = true;
    try {
      console.log('Tentando registrar usuário...');
      const dados = this.registerForm.value;
  
      // Limpar máscara do CPF
      dados.cpf = dados.cpf.replace(/\D/g, '');
  
      console.log('Dados prontos para envio:', dados);
  
      // Chamando o método de registro do AuthService
      await this.authService.register(dados);
      console.log('Usuário registrado com sucesso!');
      this.router.navigate(['/dash']); // Redirecionando para a tela de login
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      alert(`Erro ao registrar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      this.isSubmitting = false;
    }
  }
  
}