import { CdkTableModule } from '@angular/cdk/table';
import { HttpClientModule } from '@angular/common/http';
import { InjectionToken, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatSelectModule,
  MatTableModule,
  MatToolbarModule,
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { CartComponent } from './cart/cart.component';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { ProductRecentComponent } from './products/product-recent/product-recent.component';
import { CartService } from './services/cart.service';
import { ProductsService } from './services/products.service';
import { IState, reducers } from './services/reducers/reducers';
import { UserService } from './services/user.service';
import { AppCurrencyPipe } from './shared/app-currency.pipe';
import { CounterComponent } from './trainer/counter/counter.component';
import { HistoryComponent } from './trainer/history/history.component';
import { MatrixComponent } from './trainer/matrix/matrix.component';
import { LoginComponent } from './user/login/login.component';
import { LogoffComponent } from './user/logoff/logoff.component';

export const REDUCERS_TOKEN = new InjectionToken<ActionReducerMap<IState>>('Registered Reducers');

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductDetailComponent,
    ProductRecentComponent,
    CartComponent,
    LoginComponent,
    LogoffComponent,
    HistoryComponent,
    AppCurrencyPipe,
    MatrixComponent,
    CounterComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    ReactiveFormsModule,

    StoreModule.forRoot(REDUCERS_TOKEN),

    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatInputModule,
    MatCardModule,
    MatSelectModule,
    MatTableModule,
    CdkTableModule,
  ],
  providers: [
    ProductsService,
    { provide: REDUCERS_TOKEN, useValue: reducers },
    UserService,
    CartService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(productsService: ProductsService) {
    productsService.loadProducts();
  }
}
