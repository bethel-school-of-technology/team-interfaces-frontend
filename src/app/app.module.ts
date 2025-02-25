import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MarketComponent } from './components/market/market.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { CoinDetailsComponent } from './components/coin-details/coin-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './components/profile/profile.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AccountComponent } from './components/account/account.component';
import { TransferComponent } from './components/transfer/transfer.component';
import { UpdateComponent } from './components/update/update.component';



@NgModule({
  declarations: [
    AppComponent,
    MarketComponent,
    LoginComponent,
    SignupComponent,
    CoinDetailsComponent,
    ProfileComponent,
    NavbarComponent,
    AccountComponent,
    TransferComponent,
    UpdateComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ScrollingModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }