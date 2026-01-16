import { Routes } from '@angular/router';
import { FundListComponent } from './features/funds/pages/fund-list.component';
import { TransactionHistoryComponent } from './features/history/pages/transaction-history.component';

export const routes: Routes = [
  { path: '', redirectTo: 'funds', pathMatch: 'full' },
  { path: 'funds', component: FundListComponent },
  { path: 'history', component: TransactionHistoryComponent },
  { path: '**', redirectTo: 'funds' }
];
