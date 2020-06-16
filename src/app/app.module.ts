import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RestaurantListComponent } from './restaurants/restaurant-list/restaurant-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
MatPaginatorModule,
  MatTabsModule,
  MatRadioModule,
  MatCheckboxModule,
  MatSidenavModule,
  MatDividerModule,
  MatListModule,
  MatSelectModule
} from '@angular/material';
import { RestaurantDetailsComponent } from './restaurants/restaurant-details/restaurant-details.component';
import { ReviewListComponent } from './review/review-list/review-list.component';
import { ReviewCreateComponent } from './review/review-create/review-create.component';
import { ReviewPhotosComponent } from './review/review-photos/review-photos.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { AddrestaurantComponent } from './restaurants/addrestaurant/addrestaurant.component';
import { RestaurantMenuComponent } from './restaurants/restaurant-menu/restaurant-menu.component';
import { CartComponent } from './restaurants/cart/cart.component';
import { DashboardComponent } from './Admin-Restaurant/dashboard/dashboard.component';
import { SidebarComponent } from './Admin-Restaurant/sidebar/sidebar.component';
import { AddMenuComponent } from './Admin-Restaurant/add-menu/add-menu.component';
import { ListMenuComponent } from './Admin-Restaurant/list-menu/list-menu.component';
import { RestDetailsComponent } from './Admin-Restaurant/rest-details/rest-details.component';
import { OrdersComponent } from './restaurants/orders/orders.component';
import { OrdersAdminComponent } from './Admin-Restaurant/orders-admin/orders-admin.component';

@NgModule({
  declarations: [
    AppComponent,
    RestaurantListComponent,
    RestaurantDetailsComponent,
    ReviewListComponent,
    ReviewCreateComponent,
    ReviewPhotosComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent,
    AddrestaurantComponent,
    RestaurantMenuComponent,
    CartComponent,
    DashboardComponent,
    SidebarComponent,
    AddMenuComponent,
    ListMenuComponent,
    RestDetailsComponent,
    OrdersComponent,
    OrdersAdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatPaginatorModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatDividerModule,
    MatListModule,
    MatSelectModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
