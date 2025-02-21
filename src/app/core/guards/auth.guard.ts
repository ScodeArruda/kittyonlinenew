import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../features/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private _authService: AuthService, private router: Router) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return new Observable<boolean>((observer) => {
      // Verifica se o usuário está autenticado
      if (this._authService.isLoggedIn()) {
        observer.next(true);
      } else {
        // Redireciona para a tela de login caso o usuário não esteja autenticado
        this.router.navigate(['/dash']);
        observer.next(false);
      }
    });
  }
}
