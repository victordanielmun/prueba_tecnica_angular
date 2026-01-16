import { Routes } from '@angular/router';
import { FundListComponent } from './features/funds/pages/fund-list.component';
import { TransactionHistoryComponent } from './features/history/pages/transaction-history.component';
import { LoginComponent } from './features/auth/pages/login.component';
import { DashboardComponent } from './features/dashboard/pages/dashboard.component';
import { MainLayoutComponent } from './shared/layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: '', 
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'funds', component: FundListComponent },
      { path: 'history', component: TransactionHistoryComponent },
    ]
  },
  { path: '**', redirectTo: '' }
];
