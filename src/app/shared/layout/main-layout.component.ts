import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { BalanceService } from '../../core/services/balance.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="flex h-screen bg-slate-50 overflow-hidden font-sans">
      
      <!-- Mobile Sidebar Overlay -->
      @if (isSidebarOpen()) {
        <div 
          class="fixed inset-0 z-40 bg-slate-900 bg-opacity-75 transition-opacity lg:hidden backdrop-blur-sm"
          (click)="toggleSidebar()"
        ></div>
      }

      <!-- Sidebar -->
      <aside 
        class="fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white border-r border-slate-800 transform transition-transform duration-300 lg:static lg:translate-x-0 flex flex-col shadow-2xl"
        [class.translate-x-0]="isSidebarOpen()"
        [class.-translate-x-full]="!isSidebarOpen()"
      >
        <!-- Logo -->
        <div class="flex items-center h-20 px-6 border-b border-slate-800 bg-slate-900">
          <div class="flex items-center space-x-3">
             <div class="w-10 h-10 bg-gradient-to-tr from-green-400 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-green-900/50">
               <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
             </div>
             <div class="flex flex-col">
                <span class="text-lg font-bold tracking-tight text-white leading-none">BTG <span class="text-green-400">Pactual</span></span>
                <span class="text--[10px] text-slate-400 uppercase tracking-widest mt-1">Portal Clientes</span>
             </div>
          </div>
        </div>

        <!-- Nav Links -->
        <div class="flex-1 overflow-y-auto py-6">
          <nav class="space-y-1 px-4">
            <a routerLink="/funds" routerLinkActive="bg-slate-800 text-green-400" 
               class="flex items-center px-4 py-3 text-sm font-medium rounded-xl group text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200">
               <svg class="mr-3 h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
               </svg>
               Catálogo de Fondos
            </a>
            
            <a routerLink="/history" routerLinkActive="bg-slate-800 text-green-400" 
               class="flex items-center px-4 py-3 text-sm font-medium rounded-xl group text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200">
               <svg class="mr-3 h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               Historial
            </a>
          </nav>

          <!-- Balance Card in Sidebar -->
          <div class="mt-8 mx-4 p-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-lg">
             <p class="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Saldo Total</p>
             <p class="text-2xl font-bold text-white tracking-tight">
                {{ balance() | currency:'COP':'symbol-narrow':'1.0-0' }}
             </p>
             <div class="mt-3 w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div class="bg-green-500 h-full w-[20%] animate-pulse"></div>
             </div>
             <p class="text-xs text-slate-400 mt-2 text-right">Disponible para invertir</p>
          </div>
        </div>

        <!-- User Profile -->
        <div class="border-t border-slate-800 p-4 bg-slate-900">
          <div class="flex items-center">
            <div class="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold border border-slate-600">
                JD
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-white">{{ currentUser()?.name || 'Usuario' }}</p>
              <p class="text-xs text-slate-500">Inversionista</p>
            </div>
            <button class="ml-auto text-slate-500 hover:text-white transition-colors" (click)="logout()" title="Cerrar Sesión">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content Wrapper -->
      <div class="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        <!-- Top Header Mobile -->
        <header class="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 lg:px-8 z-10 sticky top-0 lg:hidden">
          <button 
            (click)="toggleSidebar()"
            class="text-slate-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
          >
            <span class="sr-only">Abrir menú</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span class="font-bold text-slate-800">BTG Pactual</span>
        </header>

        <!-- Main Scrollable Area -->
        <main class="flex-1 overflow-y-auto bg-slate-50 p-4 lg:p-8 scroll-smooth">
           <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class MainLayoutComponent {
  private authService = inject(AuthService);
  private balanceService = inject(BalanceService);

  currentUser = this.authService.currentUser;
  balance = this.balanceService.balance;
  isSidebarOpen = signal(false);

  toggleSidebar() {
    this.isSidebarOpen.update(v => !v);
  }

  logout() {
    this.authService.logout();
  }
}
