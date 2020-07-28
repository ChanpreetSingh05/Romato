import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { RestaurantsService } from '../restaurant.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-restaurant-menu',
  templateUrl: './restaurant-menu.component.html',
  styleUrls: ['./restaurant-menu.component.css']
})
export class RestaurantMenuComponent implements OnDestroy, OnInit {
  menus: any[] = [];
  restid: string;
  items: number;
  restitems: number;
  isLoading = false;
  private cartSub: Subscription;
  private menuSub: Subscription;
  parentID = '';
  userIsAuthenticated = false;
  userId: string;
  private authStatusSub: Subscription;
  item: any[];
  restitem: any[];

  constructor(public restaurantService: RestaurantsService,
    // tslint:disable-next-line: align
    private authService: AuthService,
              public route: ActivatedRoute) { }

  ngOnInit(): void {
    // this.posts = this.postsService.getPosts();
    this.isLoading = true;
    this.route.params.subscribe((params: Params) => {
      // tslint:disable-next-line: no-string-literal
      this.parentID = params['ID'];
    });
    this.restaurantService.getUserRestaurantsMenu(this.parentID);
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
        this.restitem = cart.filter(res => {
          return res.restid.match(this.parentID);
        });
        this.restitems = this.restitem.length;
        // console.log('cardt' + this.items);
      });
  }

  ngOnDestroy(): void {
    this.menuSub.unsubscribe();
    this.authStatusSub.unsubscribe();
    this.cartSub.unsubscribe();
  }

  addCart(itemid, name, cost, restname) {
    // this.router.navigate(['create'], { relativeTo: this.route });
    // tslint:disable-next-line: prefer-for-of
    this.restaurantService.addCart(itemid, name, cost, this.parentID, this.userId, restname, this.items, this.restitems);
  }

}
