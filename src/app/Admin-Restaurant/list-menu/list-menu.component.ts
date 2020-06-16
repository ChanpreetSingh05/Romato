import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { RestaurantsService } from 'src/app/restaurants/restaurant.service';
import { AuthService } from 'src/app/auth/auth.service';
import { MenuService } from '../menu.service';

@Component({
  selector: 'app-list-menu',
  templateUrl: './list-menu.component.html',
  styleUrls: ['./list-menu.component.css']
})
export class ListMenuComponent implements OnDestroy, OnInit {
  menus: any[] = [];
  isLoading = false;
  private menuSub: Subscription;
  // parentID = '';
  userIsAuthenticated = false;
  userId: string;
  private authStatusSub: Subscription;

  constructor(public restaurantService: RestaurantsService,
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
    // this.parentID = this.restaurantService.getparentID();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userId = this.authService.getUserId();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  ngOnDestroy(): void {
    this.menuSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onDelete(id: string, type: string) {
    console.log(id);
    this.restaurantService.DeleteMenu(id, type);
  }

}
