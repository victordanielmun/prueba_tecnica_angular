import { Routes } from '@angular/router';
import { FundListComponent } from './features/funds/pages/fund-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'funds', pathMatch: 'full' },
  { path: 'funds', component: FundListComponent },
  { path: '**', redirectTo: 'funds' }
];
