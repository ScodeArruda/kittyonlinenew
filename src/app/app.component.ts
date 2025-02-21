import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HttpClient, withFetch } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './features/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'kitty-online';

  http = inject(HttpClient);
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    // Subscreve ao estado de login para atualizar a interface
    this.authService.isLoggedIn$.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;
    });
    // Desabilita o cache do navegador para impedir acesso a páginas protegidas
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) => {
          registrations.forEach((registration) => registration.unregister());
        })
        .catch((err) => console.error('Erro ao desregistrar Service Workers:', err));
    }

    // Desabilita cache diretamente
    window.addEventListener('unload', () => {
      if (performance && performance.clearResourceTimings) {
        performance.clearResourceTimings();
      }
    });
  }

  //   logout() {
  //     this.authService.logout().subscribe(() => {
  //       console.log('Usuário desconectado com sucesso');
  //     });
  // }
}
