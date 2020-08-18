import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
// import { CartModel } from './cart.model';

import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private restaurants: any[] = [];
  private menus: any[] = [];
  private menusUpdated = new Subject<any[]>();
  private parentID = '';
  private orders: any[] = [];
  private ordersUpdated = new Subject<any[]>();
  // private prev_rest_id = '';
  element = {};

  constructor(private http: HttpClient, private router: Router) { }

  postMenu(name: string, cost: string, meal: string, image: File) {
    const Data = new FormData();
    Data.append('name', name);
    Data.append('image', image, 'image');
    Data.append('cost', cost);

    if (meal === 'Breakfast') {
      // 5ed6e8e672ae430bf4e55230
      // const Data = { name, cost , restid: '5ed6e8e672ae430bf4e55230'};
      this.http
        .post(BACKEND_URL + '/menu/brkfast', Data)
        .subscribe(response => {
          console.log(response);
          this.router.navigate(['/rest-admin/menu']);
        });
    } else if (meal === 'Lunch') {
      // 5ed6e8e672ae430bf4e55230
      this.http
        .post(BACKEND_URL + '/menu/lunch', Data)
        .subscribe(response => {
          console.log(response);
          this.router.navigate(['menu']);
        });
    } else if (meal === 'Dinner') {
      // 5ed6e8e672ae430bf4e55230
      this.http
        .post(BACKEND_URL + '/menu/dinner', Data)
        .subscribe(response => {
          console.log(response);
          this.router.navigate(['menu']);
        });
    }
  }

  updateMenu(id: string, name: string, cost: string, meal: string, image: File | string) {
    let Data: any | FormData;
    if (typeof image === 'object') {
      Data = new FormData();
      Data.append('id', id);
      Data.append('name', name);
      Data.append('image', image, 'image');
      Data.append('cost', cost);
    } else {
      Data = {
        id,
        name,
        cost,
        imagePath: image
      };
    }

    if (meal === 'Breakfast') {
      this.http
        .put(BACKEND_URL + '/menu/brkfastupdate', Data)
        .subscribe(response => {
          console.log(response);
          this.router.navigate(['/rest-admin/menu']);
        });
    } else if (meal === 'Lunch') {
      this.http
        .put(BACKEND_URL + '/menu/lunchupdate', Data)
        .subscribe(response => {
          console.log(response);
          this.router.navigate(['/rest-admin/menu']);
        });
    } else if (meal === 'Dinner') {
      this.http
        .put(BACKEND_URL + '/menu/dinnerupdate', Data)
        .subscribe(response => {
          console.log(response);
          this.router.navigate(['/rest-admin/menu']);
        });
    }
  }

  getEditableMenu(id: string, type: string) {
    // return [...this.posts];
    if (type === 'breakfast') {
      return this.http.get<{
        _id: string;
        name: string;
        cost: string;
        imagePath: string;
      }>
        (BACKEND_URL + '/menu/breakfastdetails/' + id);
    } else if (type === 'lunch') {
      return this.http.get<{
        _id: string;
        name: string;
        cost: string;
        imagePath: string;
      }>
        (BACKEND_URL + '/menu/lunchdetails/' + id);
    } else if (type === 'dinner') {
      return this.http.get<{
        _id: string;
        name: string;
        cost: string;
        imagePath: string;
      }>
        (BACKEND_URL + '/menu/dinnerdetails/' + id);
    }
  }

  getOrders() {
    // return [...this.posts];
    this.http.get<{ message: string, orders: any }>(
      BACKEND_URL + '/orders/admin'
    )
      .pipe(map((OrderData) => {
        return OrderData.orders.map((order) => {
          return {
            id: order._id,
            restname: order.restname,
            restid: order.restid,
            userid: order.userid,
            orders: order.orders,
            info: order.info,
            status: order.status
          };

        });
      }))
      .subscribe(TransformedData => {
        this.orders = TransformedData;
        this.ordersUpdated.next([...this.orders]);
      });
  }

  getordersUpdateListener() {
    return this.ordersUpdated.asObservable();
  }

  updateOrder(id: string, status: string) {
    // tslint:disable-next-line: object-literal-shorthand
    const update = { id: id, status: status };
    this.http
      .put(BACKEND_URL + '/orders/admin', update)
      .subscribe(response => {
        console.log(this.orders);
        this.orders.find(item => item.id === update.id).status = update.status;
        this.ordersUpdated.next([...this.orders]);
      });
  }

}
