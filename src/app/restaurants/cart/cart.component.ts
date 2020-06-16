import { Component, OnInit, OnDestroy } from '@angular/core';
import { RestaurantsService } from '../restaurant.service';
import { Subscription } from 'rxjs';
import { CartModel } from '../cart.model';
import { AuthService } from 'src/app/auth/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  public items: any[] = [];
  private cartSub: Subscription;
  public parentId = '';
  userIsAuthenticated = false;
  public userId: string;
  private authStatusSub: Subscription;
  selected = '1';
  restname: string;

  constructor(public restaurantService: RestaurantsService,
              private authService: AuthService) { }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
    this.restaurantService.getcart();
    this.cartSub = this.restaurantService.getCartUpdateListener()
      .subscribe((cart: any[]) => {
        console.log(cart);
        this.items = cart;
        // this.isLoading = false;
      });
  }

  // addCart( name, breakfast.cost, breakfast.itemid) {
  //   this.restaurantService.addCart(form.value.email, form.value.password);
  // }

  ngOnDestroy(): void {
    this.cartSub.unsubscribe();
  }

  onDelete(id: string) {
    console.log(id);
    this.restaurantService.deletePost(id);
  }

  onSubmit(form: NgForm, restid, orders, restname) {

    this.restaurantService.postorder(form.value.name, form.value.phone, form.value.address, restid, orders, restname );
  }

}
