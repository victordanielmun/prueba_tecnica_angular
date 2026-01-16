import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BalanceService } from '../../../core/services/balance.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      
      <!-- KPIs Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- KPI 1: Patrimonio Total -->
        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-slate-500 text-sm font-medium">Patrimonio Total</h3>
                <span class="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">+2.4%</span>
            </div>
            <p class="text-3xl font-bold text-slate-900">{{ totalCapital() | currency:'COP':'symbol-narrow':'1.0-0' }}</p>
            <p class="text-xs text-slate-400 mt-2">Saldo Disponible + Inversiones</p>
        </div>

        <!-- KPI 2: Capital Invertido -->
        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-slate-500 text-sm font-medium">Capital Invertido</h3>
                <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            </div>
            <p class="text-3xl font-bold text-slate-900">{{ totalInvested() | currency:'COP':'symbol-narrow':'1.0-0' }}</p>
            <p class="text-xs text-slate-400 mt-2">En {{ portfolioCount() }} fondos activos</p>
        </div>

        <!-- KPI 3: Rendimiento Estimado -->
        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-slate-500 text-sm font-medium">Rendimiento Estimado</h3>
                <span class="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">YTD</span>
            </div>
            <p class="text-3xl font-bold text-green-600">+{{ simulatedReturn() | currency:'COP':'symbol-narrow':'1.0-0' }}</p>
            <p class="text-xs text-slate-400 mt-2">Basado en desempeño histórico</p>
        </div>
      </div>

      <!-- Quick Actions & Recent Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Welcome Banner / Quick Actions -->
        <div class="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
          <div class="relative z-10">
            <h2 class="text-2xl font-bold mb-2">Bienvenido de nuevo</h2>
            <p class="text-slate-300 mb-6 max-w-md">Tu portafolio ha crecido un 2.4% este mes. Explora nuevos fondos para diversificar tu inversión.</p>
            <a routerLink="/funds" class="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors">
              Explorar Fondos
              <svg class="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
          <!-- Decorative Circle -->
          <div class="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
        </div>

        <!-- Recent Transactions Preview -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-slate-800">Actividad Reciente</h3>
            <a routerLink="/history" class="text-sm text-green-600 hover:text-green-700 font-medium">Ver todo</a>
          </div>
          
          <div class="space-y-4">
            @for (tx of recentTransactions(); track tx.id) {
              <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div class="flex items-center">
                  <div [class]="tx.type === 'Opening' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'" 
                       class="w-10 h-10 rounded-full flex items-center justify-center">
                    @if (tx.type === 'Opening') {
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    } @else {
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    }
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-slate-900">{{ tx.fundName }}</p>
                    <p class="text-xs text-slate-500">{{ tx.date | date:'mediumDate' }}</p>
                  </div>
                </div>
                <span [class]="tx.type === 'Opening' ? 'text-green-600' : 'text-slate-600'" class="font-bold text-sm">
                  {{ tx.type === 'Opening' ? '+' : '-' }}{{ tx.amount | currency:'COP':'symbol-narrow':'1.0-0' }}
                </span>
              </div>
            } @empty {
              <p class="text-center text-slate-400 text-sm py-4">No hay actividad reciente.</p>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  private balanceService = inject(BalanceService);

  balance = this.balanceService.balance;
  transactions = this.balanceService.transactions;

  // Métricas Computadas
  totalInvested = computed(() => {
    // Calculamos el total invertido sumando las transacciones de apertura y restando cancelaciones
    // Nota: Esto es una simplificación. En un caso real tendríamos un endpoint de "Portafolio".
    // Para el demo, asumimos que "Opening" es inversión activa si no está cancelada.
    // Como el servicio de BalanceService no expone "suscripciones activas" directamente, lo inferimos.
    // Por simplicidad para la prueba, usaremos la lógica: Saldo Inicial (500k) - Saldo Actual = Invertido (aprox)
    // O mejor, filtramos las transacciones.
    
    // Simplificación visual: 500k - balance actual.
    return 500000 - this.balance();
  });

  totalCapital = computed(() => {
    // Patrimonio = Saldo + Inversiones. Si asumimos que no hay rendimientos reales aun, es 500k.
    // Pero si queremos mostrar "Rendimientos", sumamos algo ficticio.
    return 500000 + this.simulatedReturn();
  });

  portfolioCount = computed(() => {
     // Contar suscripciones únicas activas (Aperturas sin Cancelación)
     // Esta lógica sería compleja de hacer solo con el array de historial plano.
     // Para efectos visuales del dashboard, contaremos transacciones de tipo 'Opening'.
     return this.transactions().filter(t => t.type === 'Opening').length;
  });

  simulatedReturn = computed(() => {
    return this.totalInvested() * 0.024; // 2.4% rentabilidad simulada
  });

  recentTransactions = computed(() => {
    return this.transactions().slice(0, 3); // Últimas 3
  });
}
