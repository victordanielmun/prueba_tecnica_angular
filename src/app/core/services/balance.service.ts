import { Injectable, signal, computed } from '@angular/core';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {
  private readonly INITIAL_BALANCE = 500000;
  
  // State
  private balanceSignal = signal<number>(this.INITIAL_BALANCE);
  private transactionsSignal = signal<Transaction[]>([]);

  // Selectors
  readonly balance = computed(() => this.balanceSignal());
  readonly transactions = computed(() => this.transactionsSignal());

  /**
   * Intenta deducir un monto del saldo actual.
   * @returns true si la operación fue exitosa, false si no hay fondos suficientes.
   */
  deduct(amount: number): boolean {
    if (amount > this.balanceSignal()) {
      return false;
    }
    this.balanceSignal.update(current => current - amount);
    return true;
  }

  /**
   * Reembolsa un monto al saldo (ej. cancelación).
   */
  refund(amount: number): void {
    this.balanceSignal.update(current => current + amount);
  }

  /**
   * Registra una nueva transacción en el historial.
   */
  addTransaction(transaction: Transaction): void {
    this.transactionsSignal.update(history => [transaction, ...history]);
  }

  /**
   * Verifica si el usuario tiene saldo suficiente sin modificar el estado.
   */
  hasSufficientFunds(amount: number): boolean {
    return this.balanceSignal() >= amount;
  }
}
