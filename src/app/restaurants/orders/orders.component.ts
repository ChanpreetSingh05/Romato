import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { RestaurantsService } from '../restaurant.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit, OnDestroy {
  public orders: any[] = [];
  private orderSub: Subscription;
  userIsAuthenticated = false;
  private authStatusSub: Subscription;

  constructor(public restaurantService: RestaurantsService, private authService: AuthService) { }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
    this.restaurantService.getOrders();
    this.orderSub = this.restaurantService.getorderUpdateListener()
      .subscribe((order: any[]) => {
        console.log(order);
        this.orders = order;
        // this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
    this.orderSub.unsubscribe();
  }
}
