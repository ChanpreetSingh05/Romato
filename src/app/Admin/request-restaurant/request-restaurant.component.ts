import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-request-restaurant',
  templateUrl: './request-restaurant.component.html',
  styleUrls: ['./request-restaurant.component.css']
})
export class RequestRestaurantComponent implements OnInit, OnDestroy {
  orders: any[] = [];
  accept: any[] = [];
  refused: any[] = [];
  isLoading = false;
  private orderSub: Subscription;
  userIsAuthenticated = false;
  userisAdmin: boolean;
  private authListenerSubs: Subscription;
  private adminListenerSubs: Subscription;
  constructor( private authService: AuthService) { }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userisAdmin = this.authService.getAdmin();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
    this.adminListenerSubs = this.authService.getAdminListener().subscribe(isAdmin => {
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
    // this.OrderService.updateOrder(id, 'Accepted');
  }

  onDelete(id: string) {
    console.log(id);
    // this.OrderService.updateOrder(id, 'Declined');
  }

}
