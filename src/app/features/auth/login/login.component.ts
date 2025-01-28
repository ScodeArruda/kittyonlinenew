import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private auth: AuthService, 
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async login() {
    const { email, password } = this.loginForm.value;
  
    try {
      await this.auth.login(email, password);
      console.log('Login bem-sucedido!');
      this.router.navigate(['/home']);
    } catch (err: unknown) {
      // Verificação de tipo para garantir que 'err' seja um Error
      if (err instanceof Error) {
        console.error('Erro ao fazer login:', err.message);
        alert('Erro ao fazer login: ' + (err.message || 'Verifique suas credenciais.'));
      } else {
        console.error('Erro desconhecido:', err);
        alert('Erro desconhecido ao tentar fazer login.');
      }
    }
  }

  loginWithGoogle() {
    this.auth.loginWithGoogle();
  }
  
}
