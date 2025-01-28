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

  login() {
    const { email, password } = this.loginForm.value;

    this.auth.login(email, password).subscribe({
      next: () => {
        console.log('Login bem-sucedido!');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Erro ao fazer login:', err);
        alert('Erro ao fazer login: ' + (err.message || 'Verifique suas credenciais.'));
      }
    });
  }
}
