import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { MenuService } from '../menu.service';

@Component({
  selector: 'app-orders-admin',
  templateUrl: './orders-admin.component.html',
  styleUrls: ['./orders-admin.component.css']
})
export class OrdersAdminComponent implements OnInit, OnDestroy {
  orders: any[] = [];
  isLoading = false;
  private orderSub: Subscription;
  userIsAuthenticated = false;
  userisAdmin: boolean;
  private authListenerSubs: Subscription;
  private adminListenerSubs: Subscription;

  constructor(private OrderService: MenuService, private authService: AuthService) { }

  ngOnInit() {
    this.isLoading = true;
    this.OrderService.getOrders();
    this.orderSub = this.OrderService.getordersUpdateListener()
      .subscribe((order: any[]) => {
        console.log(order);
        this.orders = order;
        this.isLoading = false;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userisAdmin = this.authService.getRest();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
    this.adminListenerSubs = this.authService.getRestListener().subscribe(isAdmin => {
      this.userisAdmin = isAdmin;
    });
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
    this.adminListenerSubs.unsubscribe();
    this.orderSub.unsubscribe();
  }

  onAccept(id: string) {
    console.log(id);
    this.OrderService.updateOrder(id, 'Accepted');
  }

  onDelete(id: string) {
    console.log(id);
    this.OrderService.updateOrder(id, 'Declined');
  }

}
