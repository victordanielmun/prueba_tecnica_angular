import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubscriptionModalComponent } from './subscription-modal.component';
import { BalanceService } from '../../../core/services/balance.service';
import { Fund } from '../../../core/models/fund.model';
import { ReactiveFormsModule } from '@angular/forms';

describe('SubscriptionModalComponent', () => {
  let component: SubscriptionModalComponent;
  let fixture: ComponentFixture<SubscriptionModalComponent>;
  let balanceServiceMock: jasmine.SpyObj<BalanceService>;

  const mockFund: Fund = {
    id: '1',
    name: 'Test Fund',
    minAmount: 75000,
    category: 'FPV'
  };

  beforeEach(async () => {
    balanceServiceMock = jasmine.createSpyObj('BalanceService', ['hasSufficientFunds', 'deduct', 'addTransaction']);
    
    await TestBed.configureTestingModule({
      imports: [SubscriptionModalComponent, ReactiveFormsModule],
      providers: [
        { provide: BalanceService, useValue: balanceServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SubscriptionModalComponent);
    component = fixture.componentInstance;
    
    // Set required input
    fixture.componentRef.setInput('fund', mockFund);
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.form.get('amount')?.value).toBeNull();
    expect(component.form.get('notification')?.value).toBe('email');
  });

  it('should be invalid if amount is empty', () => {
    component.form.get('amount')?.setValue(null);
    expect(component.form.valid).toBeFalse();
  });

  it('should be invalid if amount is less than minimum', () => {
    component.form.get('amount')?.setValue(50000); // Min is 75000
    expect(component.form.valid).toBeFalse();
    expect(component.form.get('amount')?.errors?.['min']).toBeTruthy();
  });

  it('should be valid if amount is correct', () => {
    component.form.get('amount')?.setValue(80000);
    expect(component.form.valid).toBeTrue();
  });

  it('should call balanceService.deduct on submit if valid', () => {
    component.form.get('amount')?.setValue(80000);
    balanceServiceMock.hasSufficientFunds.and.returnValue(true);
    balanceServiceMock.deduct.and.returnValue(true);

    component.onSubmit();

    expect(balanceServiceMock.deduct).toHaveBeenCalledWith(80000);
  });

  it('should show error if insufficient funds', () => {
    component.form.get('amount')?.setValue(80000);
    balanceServiceMock.hasSufficientFunds.and.returnValue(false);

    component.onSubmit();

    expect(component.error()).toContain('No tienes saldo suficiente');
    expect(balanceServiceMock.deduct).not.toHaveBeenCalled();
  });
});
