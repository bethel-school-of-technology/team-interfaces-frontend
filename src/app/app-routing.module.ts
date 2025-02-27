import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarketComponent } from './components/market/market.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { CoinDetailsComponent } from './components/coin-details/coin-details.component';
import { ProfileComponent } from './components/profile/profile.component'
import { UpdateComponent } from './components/update/update.component';
import { TransferComponent } from './components/transfer/transfer.component';
import { TransactionHistoryComponent } from './components/transaction-history/transaction-history.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'market', component: MarketComponent },
  { path: 'market/:coinId', component: CoinDetailsComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'transfer', component: TransferComponent },
  { path: 'update', component: UpdateComponent },
  { path: 'transaction-history', component: TransactionHistoryComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }