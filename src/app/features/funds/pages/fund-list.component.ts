import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { FundsService } from '../../../core/services/funds.service';
import { FundCardComponent } from '../../../shared/components/fund-card.component';
import { HeaderComponent } from '../../../shared/components/header.component';
import { SubscriptionModalComponent } from '../../../shared/components/subscription-modal.component';
import { Fund } from '../../../core/models/fund.model';

@Component({
  selector: 'app-fund-list',
  standalone: true,
  imports: [CommonModule, FundCardComponent, HeaderComponent, SubscriptionModalComponent],
  template: `
    <app-header></app-header>
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Alert Messages -->
        @if (successMessage()) {
          <div class="rounded-md bg-green-50 p-4 mb-6">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-green-800">{{ successMessage() }}</p>
              </div>
              <div class="ml-auto pl-3">
                <div class="-mx-1.5 -my-1.5">
                  <button (click)="successMessage.set(null)" class="inline-flex bg-green-50 rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600">
                    <span class="sr-only">Cerrar</span>
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        }

        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-semibold text-gray-900">Fondos Disponibles</h1>
          <div class="text-sm text-gray-500">Seleccione un fondo para comenzar</div>
        </div>

        @if (funds(); as fundList) {
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            @for (fund of fundList; track fund.id) {
              <app-fund-card [fund]="fund" (subscribe)="onSubscribe($event)"></app-fund-card>
            }
          </div>
        } @else {
          <div class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        }
      </div>
    </main>

    @if (selectedFund(); as fund) {
      <app-subscription-modal 
        [fund]="fund" 
        (close)="selectedFund.set(null)"
        (success)="onSuccess($event)">
      </app-subscription-modal>
    }
  `
})
export class FundListComponent {
  private fundsService = inject(FundsService);
  
  funds = toSignal(this.fundsService.getFunds());
  selectedFund = signal<Fund | null>(null);
  successMessage = signal<string | null>(null);

  onSubscribe(fund: Fund) {
    this.selectedFund.set(fund);
  }

  onSuccess(message: string) {
    this.successMessage.set(message);
    setTimeout(() => this.successMessage.set(null), 5000); // Auto-dismiss
  }
}
