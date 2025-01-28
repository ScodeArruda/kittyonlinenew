import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { AuthService } from '../auth.service';

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
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nome: ['', Validators.required],
      sobrenome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      termoAceito: [false, Validators.requiredTrue],
    });
  }

  async registerUser() {
    if (this.registerForm.invalid) {
      console.warn('Formulário inválido. Verifique os dados.');
      return;
    }

    this.isSubmitting = true;
    try {
      const dados = this.registerForm.value;

      dados.cpf = dados.cpf.replace(/\D/g, '');

      await this.authService.register(dados);
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      alert(`Erro ao registrar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      this.isSubmitting = false;
    }
  }
}