import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RestaurantsService } from '../restaurant.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-addrestaurant',
  templateUrl: './addrestaurant.component.html',
  styleUrls: ['./addrestaurant.component.css']
})
export class AddrestaurantComponent implements OnInit {
  public restaurantId: string;
  restaurant: any;
  isLoading = false;
  edited = false;
  rest = {
    breakfast: false,
    lunch: false,
    dinner: false,
    cafe: false,
    night: false,
    indoor: false,
    outdoor: false,
    alcohol: 'Non Alcohol',
    wifi: 'No Wifi',
    parking: 'No Parking',
    seating: 'Take Out',
  };
  constructor(public restaurantsService: RestaurantsService, public route: ActivatedRoute, public router: Router) { }

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('ID')) {
        this.restaurantId = paramMap.get('ID');
        this.restaurantsService.postparentID(this.restaurantId);
        this.restaurantsService.getrestaurantdetails(this.restaurantId).subscribe(restaurantData => {
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
            province: restaurantData.province,
            open: 'true',
            additional: restaurantData.additional,
          };
          this.restaurant.additional.forEach(element => {
            if (element === 'Breakfast') {
              this.rest.breakfast = true;
            }
            if (element === 'Lunch') {
              this.rest.lunch = true;
            }
            if (element === 'Dinner') {
              this.rest.dinner = true;
            }
            if (element === 'Cafe') {
              this.rest.cafe = true;
            }
            if (element === 'Night Life') {
              this.rest.night = true;
            }
            if (element === 'Indoor Seating') {
              this.rest.indoor = true;
            }
            if (element === 'Outdoor Seating') {
              this.rest.outdoor = true;
            }
            if (element === 'Alcohol' || element === 'Non Alcohol') {
              this.rest.alcohol = element;
            }
            if (element === 'Parking' || element === 'No Parking') {
              this.rest.parking = element;
            }
            if (element === 'Wifi' || element === 'No Wifi') {
              this.rest.wifi = element;
            }
            if (element === 'Dine In' || element === 'Take Out') {
              this.rest.seating = element;
            }
            console.log(element);
          });
        });
      } else {
        this.restaurantId = null;
        console.log('Invalid Data');
      }
    });
  }
  onAdding(form: NgForm) {
  console.log(form.value);
  }


}
