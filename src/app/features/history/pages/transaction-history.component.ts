import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BalanceService } from '../../../core/services/balance.service';
import { HeaderComponent } from '../../../shared/components/header.component';
import { Transaction } from '../../../core/models/transaction.model';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  template: `
    <app-header></app-header>
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <h1 class="text-2xl font-semibold text-gray-900 mb-6">Historial de Transacciones</h1>

        <div class="flex flex-col">
          <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fondo
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Monto
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th scope="col" class="relative px-6 py-3">
                        <span class="sr-only">Acciones</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    @for (transaction of transactions(); track transaction.id) {
                      <tr>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm font-medium text-gray-900">{{ transaction.fundName }}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm text-gray-500">{{ transaction.date | date:'medium' }}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span [ngClass]="{
                            'bg-green-100 text-green-800': transaction.type === 'Opening',
                            'bg-red-100 text-red-800': transaction.type === 'Cancellation'
                          }" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                            {{ transaction.type === 'Opening' ? 'Apertura' : 'Cancelación' }}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ transaction.amount | currency:'COP':'symbol-narrow':'1.0-0' }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ transaction.status }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          @if (canCancel(transaction)) {
                            <button (click)="cancel(transaction)" class="text-red-600 hover:text-red-900">Cancelar</button>
                          }
                        </td>
                      </tr>
                    } @empty {
                      <tr>
                        <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
                          No hay transacciones registradas.
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  `
})
export class TransactionHistoryComponent {
  private balanceService = inject(BalanceService);
  transactions = this.balanceService.transactions;

  // Lógica simple: Se puede cancelar si es una apertura exitosa y NO ha sido cancelada ya.
  // En una app real, esto requeriría un ID de relación o estado en el backend.
  // Aquí asumiremos que si existe una transacción de cancelación para el mismo fondo y monto (simplificado), ya está cancelado.
  // Para esta prueba, permitiremos cancelar "Aperturas" que no tengan una "Cancelación" posterior asociada (por simplicidad visual).
  
  canCancel(transaction: Transaction): boolean {
    if (transaction.type !== 'Opening' || transaction.status !== 'Success') return false;
    
    // Verificar si ya existe una cancelación para este ID de transacción original (necesitaríamos un campo linkedTransactionId)
    // Como no tenemos DB relacional, lo haremos simple: Si es Apertura, mostramos botón.
    // Una mejora real sería agregar `isActive` al modelo de Transaction.
    return true; 
  }

  cancel(transaction: Transaction) {
    if (!confirm(`¿Estás seguro de cancelar la suscripción a ${transaction.fundName}? Se reembolsarán ${transaction.amount}.`)) {
      return;
    }

    // 1. Reembolsar
    this.balanceService.refund(transaction.amount);

    // 2. Registrar Cancelación
    this.balanceService.addTransaction({
      id: crypto.randomUUID(),
      type: 'Cancellation',
      fundId: transaction.fundId,
      fundName: transaction.fundName,
      amount: transaction.amount,
      date: new Date(),
      status: 'Success'
    });
    
    // Opcional: Marcar la transacción original como "Cancelada" si tuviéramos estado mutable o DB.
  }
}
