import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BalanceService } from '../../core/services/balance.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <span class="text-xl font-bold text-blue-900">BTG Pactual</span>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <a routerLink="/funds" routerLinkActive="border-blue-500 text-gray-900" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Fondos
              </a>
              <a routerLink="/history" routerLinkActive="border-blue-500 text-gray-900" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Historial
              </a>
            </div>
          </div>
          <div class="flex items-center">
            <div class="bg-green-50 px-4 py-2 rounded-full border border-green-200">
              <span class="text-xs text-green-700 uppercase font-bold tracking-wider mr-2">Saldo Disponible</span>
              <span class="text-sm font-bold text-green-800">{{ balance() | currency:'COP':'symbol-narrow':'1.0-0' }}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class HeaderComponent {
  private balanceService = inject(BalanceService);
  balance = this.balanceService.balance;
}
