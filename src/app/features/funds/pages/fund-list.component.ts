import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { FundsService } from '../../../core/services/funds.service';
import { FundCardComponent } from '../../../shared/components/fund-card.component';
import { HeaderComponent } from '../../../shared/components/header.component';
import { Fund } from '../../../core/models/fund.model';

@Component({
  selector: 'app-fund-list',
  standalone: true,
  imports: [CommonModule, FundCardComponent, HeaderComponent],
  template: `
    <app-header></app-header>
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
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
  `
})
export class FundListComponent {
  private fundsService = inject(FundsService);
  
  // Convertir Observable a Signal para mejor DX en templates
  funds = toSignal(this.fundsService.getFunds());

  onSubscribe(fund: Fund) {
    console.log('Intento de suscripción a:', fund.name);
    // TODO: Implementar lógica de modal de suscripción en el siguiente paso
  }
}
