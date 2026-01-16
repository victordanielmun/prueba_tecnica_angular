import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);

  // Estado reactivo de autenticación
  private currentUserSignal = signal<{name: string, email: string} | null>(null);

  readonly isAuthenticated = computed(() => !!this.currentUserSignal());
  readonly currentUser = computed(() => this.currentUserSignal());

  login(email: string): boolean {
    // Simulación simple de login
    this.currentUserSignal.set({
      name: 'Juan Diaz',
      email: email
    });
    this.router.navigate(['/dashboard']);
    return true;
  }

  logout() {
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }
}
