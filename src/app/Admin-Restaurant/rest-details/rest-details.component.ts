import { Component, OnInit } from '@angular/core';
import { RestaurantsService } from 'src/app/restaurants/restaurant.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-rest-details',
  templateUrl: './rest-details.component.html',
  styleUrls: ['./rest-details.component.css']
})
export class RestDetailsComponent implements OnInit {
  public restaurantId: string;
  restaurant: any;
  isLoading = false;
  edited = false;
  constructor(public restaurantsService: RestaurantsService, public route: ActivatedRoute, public router: Router) { }

  ngOnInit() {
    this.isLoading = true;
    this.restaurantsService.getadminrestaurantdetails().subscribe(restaurantData => {
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
    });
  }

}
