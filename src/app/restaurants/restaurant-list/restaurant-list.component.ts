import { Component, OnInit, OnDestroy } from '@angular/core';
import { RestaurantModel } from '../restaurant.model';
import { Subscription } from 'rxjs';
import { RestaurantsService } from '../restaurant.service';

@Component({
  selector: 'app-restaurant-list',
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.css']
})
export class RestaurantListComponent implements OnInit, OnDestroy {
  restaurants: RestaurantModel[] = [];
  isLoading = false;
  private restaurantSub: Subscription;
  constructor(public restaurantService: RestaurantsService) { }

  ngOnInit(): void {
    // this.posts = this.postsService.getPosts();
    this.isLoading = true;
    this.restaurantService.getRestaurants();
    this.restaurantSub = this.restaurantService.getRestaurantUpdateListener()
    .subscribe((restaurant: RestaurantModel[]) => {
      console.log(restaurant);
      this.restaurants = restaurant;
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    this.restaurantSub.unsubscribe();
  }

  onDelete(id: string) {
    console.log(id);
    // this.restaurantService.deleteRestaurants(id);
  }
}
