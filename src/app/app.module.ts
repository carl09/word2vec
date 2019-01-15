import { BrowserModule } from '@angular/platform-browser';
import { NgModule, InjectionToken } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { RouterModule } from '@angular/router';
import { ProductListComponent } from './products/product-list/product-list.component';
import { ProductRecentComponent } from './products/product-recent/product-recent.component';
import { AppCurrencyPipe } from './shared/app-currency.pipe';
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
import { CdkTableModule } from '@angular/cdk/table';
import { ProductsService } from './services/products-worker.service';
import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { reducers, IState } from './services/reducers/reducers';
import { HttpClientModule } from '@angular/common/http';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';
import { UserService } from './services/user-worker.service';
import { CartService } from './services/cart-worker.service';
import { CartComponent } from './cart/cart.component';
import { LoginComponent } from './user/login/login.component';
import { LogoffComponent } from './user/logoff/logoff.component';
import { MatrixComponent } from './trainer/matrix/matrix.component';
import { HistoryComponent } from './trainer/history/history.component';
import { CounterComponent } from './trainer/counter/counter.component';

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
    CounterComponent
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
  providers: [ProductsService, { provide: REDUCERS_TOKEN, useValue: reducers }, UserService, CartService],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(productsService: ProductsService) {
    productsService.loadProducts();
  }
}
