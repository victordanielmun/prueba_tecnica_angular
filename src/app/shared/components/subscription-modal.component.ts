import { Component, input, output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Fund } from '../../core/models/fund.model';
import { BalanceService } from '../../core/services/balance.service';

@Component({
  selector: 'app-subscription-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" (click)="close.emit()"></div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Suscribirse a {{ fund().name }}
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 mb-4">
                    Monto mínimo: {{ fund().minAmount | currency:'COP':'symbol-narrow':'1.0-0' }}
                  </p>

                  <form [formGroup]="form" (ngSubmit)="onSubmit()">
                    <div class="mb-4">
                      <label for="amount" class="block text-sm font-medium text-gray-700">Monto de vinculación</label>
                      <div class="mt-1 relative rounded-md shadow-sm">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span class="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input type="number" id="amount" formControlName="amount" 
                               class="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md py-2 border" 
                               placeholder="0.00">
                      </div>
                      @if (form.get('amount')?.touched && form.get('amount')?.errors?.['required']) {
                        <p class="mt-1 text-sm text-red-600">El monto es requerido.</p>
                      }
                      @if (form.get('amount')?.touched && form.get('amount')?.errors?.['min']) {
                        <p class="mt-1 text-sm text-red-600">El monto debe ser mayor o igual al mínimo del fondo.</p>
                      }
                      @if (error()) {
                        <p class="mt-1 text-sm text-red-600">{{ error() }}</p>
                      }
                    </div>

                    <div class="mb-4">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Método de notificación</label>
                      <div class="flex items-center space-x-4">
                        <div class="flex items-center">
                          <input id="email" name="notification" type="radio" formControlName="notification" value="email" class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300">
                          <label for="email" class="ml-3 block text-sm font-medium text-gray-700">Email</label>
                        </div>
                        <div class="flex items-center">
                          <input id="sms" name="notification" type="radio" formControlName="notification" value="sms" class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300">
                          <label for="sms" class="ml-3 block text-sm font-medium text-gray-700">SMS</label>
                        </div>
                      </div>
                    </div>

                    <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <button type="submit" [disabled]="form.invalid"
                              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                        Vincularse
                      </button>
                      <button type="button" (click)="close.emit()"
                              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm">
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SubscriptionModalComponent {
  fund = input.required<Fund>();
  close = output<void>();
  success = output<string>();

  private fb = inject(FormBuilder);
  private balanceService = inject(BalanceService);
  
  error = signal<string | null>(null);

  form: FormGroup;

  constructor() {
    // Inicializamos el formulario vacío, los validadores se ajustan en ngOnInit o effect si fuera necesario
    // Pero como `fund` es un signal, mejor lo hacemos en el constructor con un efecto o simplemente al inicializar si tenemos acceso al valor (que no lo tenemos directo hasta que Angular resuelva el input).
    // Usaremos un computed o ngOnInit para actualizar validadores dinámicos.
    
    this.form = this.fb.group({
      amount: [null, [Validators.required]],
      notification: ['email', Validators.required]
    });
  }

  ngOnInit() {
    // Configurar validación de mínimo dinámicamente
    this.form.get('amount')?.addValidators(Validators.min(this.fund().minAmount));
    this.form.get('amount')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.form.invalid) return;

    const amount = this.form.get('amount')?.value;
    const fundName = this.fund().name;

    // 1. Validar Saldo
    if (!this.balanceService.hasSufficientFunds(amount)) {
      this.error.set(`No tienes saldo suficiente para vincularte al fondo ${fundName}`);
      return;
    }

    // 2. Realizar Transacción
    const success = this.balanceService.deduct(amount);
    
    if (success) {
      // Registrar transacción exitosa
      this.balanceService.addTransaction({
        id: crypto.randomUUID(),
        type: 'Opening',
        fundId: this.fund().id,
        fundName: fundName,
        amount: amount,
        date: new Date(),
        status: 'Success'
      });
      
      this.success.emit(`Te has vinculado exitosamente al fondo ${fundName}`);
      this.close.emit();
    } else {
      this.error.set('Error inesperado al procesar la transacción.');
    }
  }
}
