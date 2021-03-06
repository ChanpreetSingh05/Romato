import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RestaurantListComponent } from './restaurants/restaurant-list/restaurant-list.component';
import { RestaurantDetailsComponent } from './restaurants/restaurant-details/restaurant-details.component';
import { ReviewCreateComponent } from './review/review-create/review-create.component';
import { ReviewListComponent } from './review/review-list/review-list.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';
import { AddrestaurantComponent } from './restaurants/addrestaurant/addrestaurant.component';
import { ReviewPhotosComponent } from './review/review-photos/review-photos.component';
import { CartComponent } from './restaurants/cart/cart.component';
import { DashboardComponent } from './Admin-Restaurant/dashboard/dashboard.component';
import { AddMenuComponent } from './Admin-Restaurant/add-menu/add-menu.component';
import { ListMenuComponent } from './Admin-Restaurant/list-menu/list-menu.component';
import { RestDetailsComponent } from './Admin-Restaurant/rest-details/rest-details.component';
import { RestaurantMenuComponent } from './restaurants/restaurant-menu/restaurant-menu.component';
import { OrdersComponent } from './restaurants/orders/orders.component';
import { OrdersAdminComponent } from './Admin-Restaurant/orders-admin/orders-admin.component';
import { RequestRestaurantComponent } from './Admin/request-restaurant/request-restaurant.component';
import { RequestDetailRestaurantComponent } from './Admin/request-detail-restaurant/request-detail-restaurant.component';
import { AssignLoginComponent } from './Admin/assign-login/assign-login.component';
import { Page404Component } from './page404/page404.component';


const routes: Routes = [
  { path: '', component: RestaurantListComponent },
  {
    path: 'details/:ID', component: RestaurantDetailsComponent,
    children: [
      { path: 'read', component: ReviewListComponent },
      { path: 'create', component: ReviewCreateComponent, canActivate: [AuthGuard] },
      { path: 'photos', component: ReviewPhotosComponent },
      { path: '', component: ReviewListComponent }

    ]
  },
  { path: 'write/:reviewId', component: ReviewCreateComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'addrestaurant', component: AddrestaurantComponent },
  { path: 'addrestaurant/:ID', component: AddrestaurantComponent },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard]  },
  { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard]  },
  {
    path: 'rest-admin', component: DashboardComponent, canActivate: [AuthGuard],
    children: [
      { path: 'create', component: AddMenuComponent },
      { path: 'create/:type/:ID', component: AddMenuComponent },
      { path: 'menu', component: ListMenuComponent },
      { path: '', component: RestDetailsComponent },
      { path: 'orders', component: OrdersAdminComponent }
    ]
  },
  {
    path: 'admin', component: DashboardComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: RequestRestaurantComponent },
      {path: 'details/:ID', component: RequestDetailRestaurantComponent },
      {path: 'assign', component: AssignLoginComponent }
    ]
  },
  { path: '**' , component: Page404Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
