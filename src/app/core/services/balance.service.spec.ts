import { TestBed } from '@angular/core/testing';
import { BalanceService } from './balance.service';

describe('BalanceService', () => {
  let service: BalanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BalanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial balance of 500,000', () => {
    expect(service.balance()).toBe(500000);
  });

  it('should deduct amount correctly when sufficient funds', () => {
    const success = service.deduct(100000);
    expect(success).toBeTrue();
    expect(service.balance()).toBe(400000);
  });

  it('should NOT deduct amount when insufficient funds', () => {
    const success = service.deduct(600000);
    expect(success).toBeFalse();
    expect(service.balance()).toBe(500000);
  });

  it('should refund amount correctly', () => {
    service.deduct(100000); // 400k left
    service.refund(50000);
    expect(service.balance()).toBe(450000);
  });

  it('should record transactions', () => {
    const mockTx = {
      id: '1',
      type: 'Opening' as const,
      fundId: '1',
      fundName: 'Test Fund',
      amount: 100000,
      date: new Date(),
      status: 'Success' as const
    };

    service.addTransaction(mockTx);
    expect(service.transactions().length).toBe(1);
    expect(service.transactions()[0]).toEqual(mockTx);
  });
});
