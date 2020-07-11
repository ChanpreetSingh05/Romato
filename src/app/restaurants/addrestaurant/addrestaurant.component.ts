import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RestaurantsService } from '../restaurant.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-addrestaurant',
  templateUrl: './addrestaurant.component.html',
  styleUrls: ['./addrestaurant.component.css']
})
export class AddrestaurantComponent implements OnInit {
  public restaurantId: string;
  private mode = 'create';
  public btn = 'Submit';
  restaurant: any;
  form: FormGroup;
  imagePreview: string;
  CoverPreview: string;
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
    this.form = new FormGroup({
      restaurantname: new FormControl(null, { validators: [Validators.required] }),
      restaurantcuisine: new FormControl(null, { validators: [Validators.required, Validators.min(1)] }),
      restaurantcontact: new FormControl(null, { validators: [Validators.required] }),
      restaurantstreet: new FormControl(null, { validators: [Validators.required] }),
      restauranthouse: new FormControl(null, { validators: [Validators.required] }),
      restaurantcity: new FormControl(null, { validators: [Validators.required] }),
      restaurantpostal: new FormControl(null, { validators: [Validators.required] }),
      restaurantprovince: new FormControl(null, { validators: [Validators.required] }),
      restaurantcost: new FormControl(null, { validators: [Validators.required] }),
      restaurantOpeningStatus: new FormControl(null),
      restaurantAlcohol: new FormControl(null),
      restaurantdinein: new FormControl(null),
      restaurantbreakfast: new FormControl(null),
      restaurantlunch: new FormControl(null),
      restaurantdinner: new FormControl(null),
      restaurantcafe: new FormControl(null),
      restaurantnightlife: new FormControl(null),
      indoorseating: new FormControl(null),
      outdoorseating: new FormControl(null),
      restaurantwifi: new FormControl(null),
      restaurantparking: new FormControl(null),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
      cover: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('ID')) {
        this.mode = 'edit';
        this.restaurantId = paramMap.get('ID');
        this.isLoading = true;
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
          this.form.setValue({
            restaurantname: this.restaurant.name,
            restaurantcuisine: this.restaurant.cuisine,
            restaurantcontact: this.restaurant.contact,
            restaurantstreet: this.restaurant.st_name,
            restauranthouse: this.restaurant.house_no,
            restaurantcity: this.restaurant.city,
            restaurantpostal: this.restaurant.postal_code,
            restaurantprovince: this.restaurant.province,
            restaurantcost: this.restaurant.cost,
            restaurantOpeningStatus: this.restaurant.open,
            restaurantAlcohol: this.rest.alcohol,
            restaurantdinein: this.rest.seating,
            restaurantbreakfast: this.rest.breakfast,
            restaurantlunch: this.rest.lunch,
            restaurantdinner: this.rest.dinner,
            restaurantcafe: this.rest.cafe,
            restaurantnightlife: this.rest.night,
            indoorseating: this.rest.indoor,
            outdoorseating: this.rest.outdoor,
            restaurantwifi: this.rest.wifi,
            restaurantparking: this.rest.parking,
            image: '',
            cover: ''
          });

          this.btn = 'Edit Menu';
        });
      } else {
        this.restaurantId = null;
        this.mode = 'create';
        this.btn = 'Add Menu';
        console.log('Invalid Data');
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    console.log(file);
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onCoverPicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ cover: file });
    this.form.get('cover').updateValueAndValidity();
    console.log(file);
    const reader = new FileReader();
    reader.onload = () => {
      this.CoverPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onAdding(form: NgForm) {
  console.log(form.value);
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      console.log(this.form.value.name, this.form.value.cost, this.form.value.meal, this.form.value.image);
    } else {
      // this.restaurantsService.postMenu();
      console.log(this.restaurantId, this.form.value);
    }
    // console.log(this.arr);
    // this.menuService.postMenu(form.value.name, form.value.cost, form.value.meal);
    // this.form.reset();
    this.isLoading = false;
  }

}
