import { Component, OnInit } from '@angular/core';
import { RestaurantModel } from '../restaurant.model';
import { Subscription } from 'rxjs';
import { RestaurantsService } from '../restaurant.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-restaurant-details',
  templateUrl: './restaurant-details.component.html',
  styleUrls: ['./restaurant-details.component.css']
})
export class RestaurantDetailsComponent implements OnInit {
  public restaurantId: string;
  restaurant: any;
  isLoading = false;
  edited = false;
  constructor(public restaurantsService: RestaurantsService, public route: ActivatedRoute, public router: Router) { }

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('ID')) {
        this.restaurantId = paramMap.get('ID');
        this.restaurantsService.postparentID(this.restaurantId);
        this.restaurantsService.getrestaurantdetails(this.restaurantId).subscribe(restaurantData => {
          console.log(restaurantData);
          this.isLoading = false;
          this.restaurant = {
            id: restaurantData._id,
            name: restaurantData.name,
            contact: restaurantData.contact,
            city: restaurantData.city,
            cuisine: restaurantData.cuisines,
            cost: restaurantData.cost,
            house_no: restaurantData.house_no,
            st_name: restaurantData.st_name,
            postal_code: restaurantData.postal_code,
            imagePath: restaurantData.imagePath,
            additional: restaurantData.additional
          };
          console.log(this.restaurant.city);
        });
        console.log('hi' + this.restaurantId);
      } else {
        this.restaurantId = null;
        console.log('Invalid Data');
      }
    });
  }

  writeComment() {
    this.router.navigate(['create'], { relativeTo: this.route });
    // console.log(this.restaurantId);
  }

  showComment() {
    this.router.navigate(['read'], { relativeTo: this.route });
  }

  fireEvent(a) {
    if (a.index === 1) {
      console.log(a.index);
      this.router.navigate(['photos'], { relativeTo: this.route });
      this.edited = true;
    } else if (a.index === 2) {
      console.log(a.index);
      this.router.navigate(['create'], { relativeTo: this.route });
      this.edited = true;
    } else {
      console.log(a.index);
      this.edited = false;
    }
  }

}
