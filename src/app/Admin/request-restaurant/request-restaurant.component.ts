import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { RestaurantsService } from 'src/app/restaurants/restaurant.service';
import { RestaurantModel } from 'src/app/restaurants/restaurant.model';

@Component({
  selector: 'app-request-restaurant',
  templateUrl: './request-restaurant.component.html',
  styleUrls: ['./request-restaurant.component.css']
})
export class RequestRestaurantComponent implements OnInit, OnDestroy {
  rest: RestaurantModel[] = [];
  accept: any[] = [];
  refused: any[] = [];
  isLoading = false;
  private restSub: Subscription;
  userIsAuthenticated = false;
  userisAdmin: boolean;
  private authListenerSubs: Subscription;
  private adminListenerSubs: Subscription;
  constructor( private authService: AuthService, private RestService: RestaurantsService ) { }

  ngOnInit() {
    this.isLoading = true;
    this.RestService.getPendingRestaurants();
    this.restSub = this.RestService.getPendingRestaurantUpdateListener()
      .subscribe((items: any[]) => {
        console.log(items);
        this.rest = items;
        this.isLoading = false;
        this.rest = items.filter(res => {
          return res.active_stts.match('Pending');
        });
        this.isLoading = false;
        this.accept = items.filter(res => {
          return res.active_stts.match('Accepted');
        });
        this.refused = items.filter(res => {
          return res.active_stts.match('Declined');
        });
      });

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
    this.restSub.unsubscribe();
  }

  onAccept(id: string) {
    console.log(id);
    this.RestService.updateRestaurant(id, 'Accepted');
  }

  onDelete(id: string) {
    console.log(id);
    this.RestService.updateRestaurant(id, 'Declined');
  }

}
