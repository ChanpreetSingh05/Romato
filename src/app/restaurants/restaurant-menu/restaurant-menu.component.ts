import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { RestaurantsService } from '../restaurant.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-restaurant-menu',
  templateUrl: './restaurant-menu.component.html',
  styleUrls: ['./restaurant-menu.component.css']
})
export class RestaurantMenuComponent implements OnDestroy, OnInit {
  menus: any[] = [];
  restid: string;
  items: number;
  isLoading = false;
  private cartSub: Subscription;
  private menuSub: Subscription;
  parentID = '';
  userIsAuthenticated = false;
  userId: string;
  private authStatusSub: Subscription;
  item: any[];

  constructor(public restaurantService: RestaurantsService,
    // tslint:disable-next-line: align
    private authService: AuthService) { }

  ngOnInit(): void {
    // this.posts = this.postsService.getPosts();
    this.isLoading = true;
    this.restaurantService.getRestaurantsMenu();
    this.menuSub = this.restaurantService.getMenuUpdateListener()
      .subscribe((menu) => {
        this.menus = menu;
        this.isLoading = false;
        // console.log('idhr' + menu._id);
      });
    this.parentID = this.restaurantService.getparentID();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userId = this.authService.getUserId();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });

    this.restaurantService.getcart();
    this.cartSub = this.restaurantService.getCartUpdateListener()
      .subscribe(cart => {
        this.item = cart;
        this.items = cart.length;
      });
  }

  ngOnDestroy(): void {
    this.menuSub.unsubscribe();
    this.authStatusSub.unsubscribe();
    this.cartSub.unsubscribe();
  }

  addCart(itemid, name, cost, restname) {
    // this.router.navigate(['create'], { relativeTo: this.route });
    // console.log(this.authService.getUserId());
    console.log(this.item);
    // tslint:disable-next-line: prefer-for-of
    if (this.parentID === this.restid) {
      console.log('differ');
    } else {
      console.log(this.items);
      this.restaurantService.addCart(itemid, name, cost, this.parentID, this.userId, restname, this.items);
    }
  }

}
