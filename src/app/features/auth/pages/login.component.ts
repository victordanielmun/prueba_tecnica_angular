import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen w-full flex bg-white font-sans">
      <!-- Left Side: Investment Branding -->
      <div class="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 opacity-95 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1611974765270-ca12586343bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
          class="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50" 
          alt="Financial background"
        >
        <div class="relative z-20 text-white p-12 max-w-lg">
          <div class="mb-6">
            <span class="px-3 py-1 rounded-full border border-green-400 text-green-400 text-xs font-semibold tracking-wide uppercase">Simulación BTG Pactual</span>
          </div>
          <h2 class="text-5xl font-bold mb-6 tracking-tight leading-tight">Haz crecer tu capital con confianza.</h2>
          <p class="text-slate-300 text-lg leading-relaxed">
            Accede a fondos de inversión exclusivos. Gestiona tus portafolios FPV y FIC en tiempo real con nuestra plataforma segura.
          </p>
          
          <!-- Financial decoration -->
          <div class="mt-12 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
             <div class="flex justify-between items-center mb-2">
                <span class="text-sm text-slate-300">Índice de Mercado</span>
                <span class="text-green-400 font-bold text-sm">+2.45%</span>
             </div>
             <div class="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div class="bg-green-400 h-full w-2/3"></div>
             </div>
          </div>
        </div>
      </div>

      <!-- Right Side: Login Form -->
      <div class="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative">
        <div class="w-full max-w-md space-y-8">
          <div class="text-center lg:text-left">
            <h1 class="text-3xl font-bold tracking-tight text-slate-900">Portal Inversionista</h1>
            <p class="mt-2 text-sm text-slate-500">
              Ingresa tus credenciales para gestionar tu portafolio.
            </p>
          </div>

          <form class="mt-8 space-y-6" (submit)="$event.preventDefault(); onLogin()">
            <div class="space-y-5">
              <div>
                <label for="email" class="block text-sm font-medium text-slate-700">Correo Electrónico</label>
                <div class="mt-1 relative">
                   <input 
                    id="email" 
                    name="email" 
                    [(ngModel)]="email"
                    type="email" 
                    autocomplete="email" 
                    required 
                    class="block w-full appearance-none rounded-lg border border-slate-300 bg-white text-slate-900 px-3 py-3 placeholder-slate-400 shadow-sm focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 sm:text-sm transition-all" 
                    placeholder="usuario@ejemplo.com">
                </div>
              </div>

              <div>
                <label for="password" class="block text-sm font-medium text-slate-700">Contraseña</label>
                <div class="mt-1">
                  <input 
                    id="password" 
                    name="password" 
                    type="password" 
                    autocomplete="current-password" 
                    required 
                    class="block w-full appearance-none rounded-lg border border-slate-300 bg-white text-slate-900 px-3 py-3 placeholder-slate-400 shadow-sm focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 sm:text-sm transition-all" 
                    placeholder="••••••••">
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-green-600 focus:ring-green-600 cursor-pointer">
                <label for="remember-me" class="ml-2 block text-sm text-slate-900 cursor-pointer">Recordarme</label>
              </div>
            </div>

            <div>
              <button type="submit" class="group relative flex w-full justify-center rounded-lg border border-transparent bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-all transform hover:scale-[1.01] shadow-lg">
                Ingresar Seguro
              </button>
            </div>
            
            <div class="text-center text-xs text-slate-400 mt-4">
               Al acceder a esta plataforma, aceptas nuestros Términos de Servicio y Política de Privacidad sobre el manejo de datos financieros.
            </div>

          </form>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private authService = inject(AuthService);
  email = '';

  onLogin() {
    this.authService.login(this.email);
  }
}
