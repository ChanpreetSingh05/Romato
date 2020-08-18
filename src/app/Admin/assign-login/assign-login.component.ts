import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { RestaurantsService } from 'src/app/restaurants/restaurant.service';
import { RestaurantModel } from 'src/app/restaurants/restaurant.model';

@Component({
  selector: 'app-assign-login',
  templateUrl: './assign-login.component.html',
  styleUrls: ['./assign-login.component.css']
})
export class AssignLoginComponent implements OnInit, OnDestroy {
  selectedValue: string;
  selected: RestaurantModel;
  boolsel = false;
  admin = false;

  rest: RestaurantModel[] = [];
  isLoading = false;
  private restSub: Subscription;
  userIsAuthenticated = false;
  userisAdmin: boolean;
  private authListenerSubs: Subscription;
  private adminListenerSubs: Subscription;

  constructor(private authService: AuthService, private RestService: RestaurantsService) { }

  ngOnInit() {
    this.isLoading = true;
    this.RestService.getPendingRestaurants();
    this.restSub = this.RestService.getPendingRestaurantUpdateListener()
      .subscribe((restaurants) => {
        this.rest = restaurants;
        this.rest = restaurants.filter(res => {
          return !res.status.valueOf() && res.active_stts.match('Accepted');
        });
        // this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.restSub.unsubscribe();
  }

  Submit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    // console.log(this.selected.email + ' ' + form.value.admin);
    this.authService.createUser(this.selected.email, form.value.pass, this.selected.id, true, false, this.selected.name);
  }

  GetDetail(form: NgForm) {
    if (form.invalid) {
      return;
    }
    // this.calendarshift.postShift(form.value.employee, this.datevalue);
    console.log(form.value.restaurant);
    this.selected = form.value.restaurant;
    this.selected = {
      id: form.value.restaurant.id,
      name: form.value.restaurant.name,
      email: form.value.restaurant.email,
      contact: form.value.restaurant.contact,
      city: form.value.restaurant.city,
      cuisines: form.value.restaurant.cuisines,
      cost: form.value.restaurant.cost,
      house_no: form.value.restaurant.house_no,
      st_name: form.value.restaurant.st_Name,
      postal_code: form.value.restaurant.postal_code,
      imagePath: form.value.restaurant.imagePath,
      province: form.value.restaurant.province,
      status: form.value.restaurant.status,
      active_stts: form.value.restaurant.active_stts,
      cover: form.value.restaurant.cover,
      additional: form.value.restaurant.additional,
    };
    this.boolsel = true;
  }

}
