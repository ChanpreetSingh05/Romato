import { Component, OnInit, OnDestroy } from '@angular/core';
import { RestaurantsService } from 'src/app/restaurants/restaurant.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-request-detail-restaurant',
  templateUrl: './request-detail-restaurant.component.html',
  styleUrls: ['./request-detail-restaurant.component.css']
})
export class RequestDetailRestaurantComponent implements OnInit, OnDestroy {
  public restaurantId: string;
  restaurant: any;
  isLoading = false;
  edited = false;
  private restSub: Subscription;
  constructor(public restaurantsService: RestaurantsService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('ID')) {
        this.restaurantId = paramMap.get('ID');
        this.restSub = this.restaurantsService.getrestaurantdetails(this.restaurantId).subscribe(restaurantData => {
          console.log(restaurantData);
          this.isLoading = false;
          this.restaurant = {
            id: restaurantData._id,
            name: restaurantData.name,
            email: restaurantData.email,
            contact: restaurantData.contact,
            city: restaurantData.city,
            cuisine: restaurantData.cuisines,
            cost: restaurantData.cost,
            house_no: restaurantData.house_no,
            st_name: restaurantData.st_name,
            postal_code: restaurantData.postal_code,
            imagePath: restaurantData.imagePath,
            cover: restaurantData.cover,
            additional: restaurantData.additional,
            status: restaurantData.status,
            active_stts: restaurantData.active_stts
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

  ngOnDestroy() {
    this.restSub.unsubscribe();
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
