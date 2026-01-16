export type TransactionType = 'Opening' | 'Cancellation';
export type TransactionStatus = 'Success' | 'Failed';

export interface Transaction {
  id: string;
  type: TransactionType;
  fundId: string;
  fundName: string;
  amount: number;
  date: Date;
  status: TransactionStatus;
}
