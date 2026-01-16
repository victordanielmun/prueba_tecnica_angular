import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Fund } from '../../../core/models/fund.model';

@Component({
  selector: 'app-fund-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300 border border-gray-100">
      <div class="px-4 py-5 sm:p-6">
        <div class="flex justify-between items-start">
          <div>
            <span [ngClass]="{'bg-blue-100 text-blue-800': fund().category === 'FPV', 'bg-purple-100 text-purple-800': fund().category === 'FIC'}" 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
              {{ fund().category }}
            </span>
            <h3 class="mt-2 text-lg leading-6 font-medium text-gray-900">{{ fund().name }}</h3>
          </div>
        </div>
        <div class="mt-4">
          <p class="text-sm text-gray-500">Monto mínimo de vinculación</p>
          <p class="text-2xl font-bold text-gray-900">{{ fund().minAmount | currency:'COP':'symbol-narrow':'1.0-0' }}</p>
        </div>
        <div class="mt-5">
          <button (click)="subscribe.emit(fund())" 
                  class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Vincular
          </button>
        </div>
      </div>
    </div>
  `
})
export class FundCardComponent {
  fund = input.required<Fund>();
  subscribe = output<Fund>();
}
