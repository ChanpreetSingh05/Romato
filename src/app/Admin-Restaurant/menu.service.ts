import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
// import { CartModel } from './cart.model';

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

  postMenu(name: string, cost: string, meal: string) {

    if (meal === 'Breakfast') {
      // 5ed6e8e672ae430bf4e55230
      const Data = { name, cost , restid: '5ed6e8e672ae430bf4e55230'};
      this.http
        .post('http://localhost:3000/api/menu/brkfast', Data)
        .subscribe(response => {
          console.log(response);
        });
    } else if (meal === 'Lunch') {
      // 5ed6e8e672ae430bf4e55230
      const Data = { name, cost , restid: '5ed6e8e672ae430bf4e55230'};
      this.http
        .post('http://localhost:3000/api/menu/lunch', Data)
        .subscribe(response => {
          console.log(response);
        });
    } else if (meal === 'Dinner') {
      // 5ed6e8e672ae430bf4e55230
      const Data = { name, cost , restid: '5ed6e8e672ae430bf4e55230' };
      this.http
        .post('http://localhost:3000/api/menu/dinner', Data)
        .subscribe(response => {
          console.log(response);
        });
    }
  }

  updateMenu(id: string, name: string, cost: string, meal: string) {
    const Data: any = {
      id,
      name,
      cost
    };
    if (meal === 'Breakfast') {
      this.http
        .put('http://localhost:3000/api/menu/brkfastupdate', Data)
        .subscribe(response => {
          console.log(response);
        });
    } else if (meal === 'Lunch') {
      this.http
        .put('http://localhost:3000/api/menu/lunchupdate', Data)
        .subscribe(response => {
          console.log(response);
        });
    } else if (meal === 'Dinner') {
      this.http
        .put('http://localhost:3000/api/menu/dinnerupdate', Data)
        .subscribe(response => {
          console.log(response);
        });
    }
  }

  getEditableMenu(id: string, type: string) {
    // return [...this.posts];
    if (type === 'breakfast') {
      return this.http.get<{ _id: string;
        name: string;
        cost: string; }>
        ('http://localhost:3000/api/menu/breakfastdetails/' + id);
    } else if (type === 'lunch') {
      return this.http.get<{ _id: string;
        name: string;
        cost: string; }>
        ('http://localhost:3000/api/menu/lunchdetails/' + id);
    } else if (type === 'dinner') {
      return this.http.get<{ _id: string;
        name: string;
        cost: string; }>
        ('http://localhost:3000/api/menu/dinnerdetails/' + id);
    }
  }

  getOrders() {
    // return [...this.posts];
    this.http.get<{ message: string, orders: any }>(
      'http://localhost:3000/api/orders/admin'
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
      .put('http://localhost:3000/api/orders/admin', update)
      .subscribe(response => {
        console.log(response);
      });
  }

}
