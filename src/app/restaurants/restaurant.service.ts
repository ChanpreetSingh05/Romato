import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { RestaurantModel } from './restaurant.model';
import { Subject, Subscription } from 'rxjs';
import { CartModel } from './cart.model';

@Injectable({
  providedIn: 'root'
})
export class RestaurantsService {
  private restaurants: RestaurantModel[] = [];
  private pendingrestaurants: RestaurantModel[] = [];
  private menus: any[] = [];
  private additional: Array<string> = [];
  private restaurantsUpdated = new Subject<RestaurantModel[]>();
  private pendingrestaurantsUpdated = new Subject<RestaurantModel[]>();
  private menusUpdated = new Subject<any[]>();
  private parentID = '';
  cart: any[] = [];
  private cartUpdated = new Subject<CartModel[]>();
  order: any[] = [];
  private orderUpdated = new Subject<any[]>();


  constructor(private http: HttpClient, private router: Router) { }

  postparentID(id) {
    this.parentID = id;
  }

  getparentID() {
    if (this.parentID !== '') {
      return this.parentID;
    } else {
      return;
    }
  }

  // To be Done
  postRest(name: string, email: string, cuisine: string, contact: string, street: string, house: string, city: string, postal: string,
           province: string,
           cost: string,
           Alcohol: string,
           dinein: string,
           breakfast: boolean,
           lunch: boolean,
           dinner: boolean,
           cafe: boolean,
           nightlife: boolean,
           indoorseating: boolean,
           outdoorseating: boolean,
           wifi: string,
           parking: string,
           image: File,
           cover: File) {

    this.additional.push(Alcohol);
    this.additional.push(dinein);
    this.additional.push(wifi);
    this.additional.push(parking);
    if (breakfast === true) {
      this.additional.push('Breakfast');
    }
    if (lunch === true) {
      this.additional.push('Lunch');
    }
    if (dinner === true) {
      this.additional.push('Dinner');
    }
    if (cafe === true) {
      this.additional.push('Cafe');
    }
    if (nightlife === true) {
      this.additional.push('Night Life');
    }
    if (indoorseating === true) {
      this.additional.push('Indoor Seating');
    }
    if (outdoorseating === true) {
      this.additional.push('Outdoor Seating');
    }

    let resData: any | FormData;
    resData = new FormData();
    resData.append('name', name);
    resData.append('image', image, 'image');
    resData.append('email', email);
    resData.append('cover', cover, 'cover');
    resData.append('cuisine', cuisine);
    resData.append('contact', contact);
    resData.append('street', street);
    resData.append('house', house);
    resData.append('city', city);
    resData.append('postal', postal);
    resData.append('province', province);
    resData.append('cost', cost);
    resData.append('additional', this.additional);
    this.http.post('http://localhost:3000/api/restaurants', resData).subscribe(response => {
      console.log(response);
    });
  }


  getRestaurants() {
    // return [...this.posts];
    this.http.get<{ message: string, restaurant: any }>(
      'http://localhost:3000/api/restaurants'
    )
      .pipe(map((restaurantData) => {
        return restaurantData.restaurant.map((restaurant) => {
          return {
            name: restaurant.name,
            email: restaurant.email,
            contact: restaurant.contact,
            cuisines: restaurant.cuisines,
            house_no: restaurant.house_no,
            st_Name: restaurant.st_name,
            city: restaurant.city,
            province: restaurant.province,
            postal_code: restaurant.postal_code,
            cost: restaurant.cost,
            imagePath: restaurant.imagePath,
            cover: restaurant.cover,
            id: restaurant._id
          };
        });
      }))
      .subscribe(TransformedData => {
        this.restaurants = TransformedData;
        this.restaurantsUpdated.next([...this.restaurants]);
      });
  }

  getRestaurantUpdateListener() {
    return this.restaurantsUpdated.asObservable();
  }

  getrestaurantdetails(id: string) {
    // tslint:disable-next-line: max-line-length
    return this.http.get<{ _id: string, name: string, email: string, contact: number, city: string, cuisines: string, province: string, cost: string, house_no: string, st_name: string, postal_code: string, imagePath: string, cover: string, additional: Array<string>, status: boolean, active_stts: string }>(
      'http://localhost:3000/api/restaurants/details/' + id
    );
  }

  getadminrestaurantdetails() {
    // tslint:disable-next-line: max-line-length
    return this.http.get<{ _id: string, name: string, email: string, contact: number, city: string, cuisines: string, cost: string, house_no: string, st_name: string, postal_code: string, imagePath: string, cover: string, additional: Array<string> }>(
      'http://localhost:3000/api/restaurants/adminrestdetails'
    );
  }

  getPendingRestaurants() {
    // return [...this.posts];
    this.http.get<{ message: string, restaurant: any }>(
      'http://localhost:3000/api/restaurants/admin'
    )
      .pipe(map((restaurantData) => {
        return restaurantData.restaurant.map((restaurant) => {
          return {
            name: restaurant.name,
            email: restaurant.email,
            contact: restaurant.contact,
            cuisines: restaurant.cuisines,
            house_no: restaurant.house_no,
            st_Name: restaurant.st_name,
            city: restaurant.city,
            province: restaurant.province,
            postal_code: restaurant.postal_code,
            cost: restaurant.cost,
            imagePath: restaurant.imagePath,
            cover: restaurant.cover,
            id: restaurant._id,
            additional: restaurant.additional,
            status: restaurant.status,
            active_stts: restaurant.active_stts
          };
        });
      }))
      .subscribe(TransformedData => {
        this.pendingrestaurants = TransformedData;
        this.pendingrestaurantsUpdated.next([...this.pendingrestaurants]);
      });
  }

  getPendingRestaurantUpdateListener() {
    return this.pendingrestaurantsUpdated.asObservable();
  }

  updateRestaurant(id: string, status: string) {
    // tslint:disable-next-line: object-literal-shorthand
    const update = { id: id, status: status };
    this.http
      .put('http://localhost:3000/api/restaurants/admin', update)
      .subscribe(response => {
        this.pendingrestaurants.find(item => item.id === update.id).active_stts = update.status;
        this.pendingrestaurantsUpdated.next([...this.pendingrestaurants]);
      });
  }

  updateRestAccount(id: string, status: boolean) {
    // tslint:disable-next-line: object-literal-shorthand
    const update = { id: id, status: status };
    this.http
      .put('http://localhost:3000/api/restaurants/admin/account', update)
      .subscribe(response => {
        this.pendingrestaurants.find(item => item.id === update.id).status = update.status;
        this.pendingrestaurantsUpdated.next([...this.pendingrestaurants]);
      });
  }

  getUserRestaurantsMenu(id: string) {
    // return [...this.posts];

    this.http.get<{ message: string, menu: any }>(
      'http://localhost:3000/api/menu/' + id
    )
      .pipe(map((MenuData) => {
        return MenuData.menu.map((menu) => {
          // console.log('service' + menu.restaurantID);
          return {
            breakfast: menu.breakfast,
            lunch: menu.lunch,
            dinner: menu.dinner,
            id: menu._id,
            restaurant: menu.restid,
            restname: menu.restname
          };

        });
      }))
      .subscribe(TransformedData => {
        this.menus = TransformedData;
        this.menusUpdated.next([...this.menus]);
      });
  }

  getRestaurantsMenu() {
    // return [...this.posts];

    this.http.get<{ message: string, menu: any }>(
      'http://localhost:3000/api/menu'
    )
      .pipe(map((MenuData) => {
        return MenuData.menu.map((menu) => {
          // console.log('service' + menu.restaurantID);
          return {
            breakfast: menu.breakfast,
            lunch: menu.lunch,
            dinner: menu.dinner,
            id: menu._id,
            restaurant: menu.restid,
            restname: menu.restname
          };

        });
      }))
      .subscribe(TransformedData => {
        this.menus = TransformedData;
        this.menusUpdated.next([...this.menus]);
      });
  }

  getMenuUpdateListener() {
    return this.menusUpdated.asObservable();
  }

  DeleteMenu(id: string, type: string) {
    const Data: any = {
      id
    };
    // return [...this.posts];
    if (type === 'breakfast') {
      this.http.put('http://localhost:3000/api/menu/brkfastdelete', Data)
        .subscribe(() => {
          this.menus.forEach((o) => {
            o.breakfast = o.breakfast.filter(s => s._id !== id);
          });
          this.menusUpdated.next([...this.menus]);
          // this.router.navigate(['employeelist']);
        });
    } else if (type === 'lunch') {
      this.http.put('http://localhost:3000/api/menu/lunchdelete', Data)
        .subscribe(() => {
          this.menus.forEach((o) => {
            o.lunch = o.lunch.filter(s => s._id !== id);
          });
          this.menusUpdated.next([...this.menus]);
        });
    } else if (type === 'dinner') {
      this.http.put('http://localhost:3000/api/menu/dinnerdelete', Data)
        .subscribe(() => {
          this.menus.forEach((o) => {
            o.dinner = o.dinner.filter(s => s._id !== id);
          });
          this.menusUpdated.next([...this.menus]);
          // this.router.navigate(['employeelist']);
        });
    }
  }

  addCart(itemid: string, name: string, cost: number, restid: string, userid: string, restname: string, items: number, restitems: number) {
    // console.log('while add' + items);

    if (items > 0) {
      const cartData = { itemid, name, cost, restid, userid, restname };
      if (restitems > 0) {
        console.log('updating');
        this.http.put('http://localhost:3000/api/restaurants/updatecart', cartData)
          .subscribe(response => {
            console.log(response);
            this.router.navigate(['/cart']);
          });
      } else {
        this.http.delete('http://localhost:3000/api/restaurants/cart')
          .subscribe(() => {
            this.http
              .post('http://localhost:3000/api/restaurants/cart', cartData)
              .subscribe(response => {
                console.log(response);
                this.router.navigate(['/cart']);
              });
          });
      }
    } else {
      const cartData = { itemid, name, cost, restid, userid, restname };
      console.log('adding');
      this.http
        .post('http://localhost:3000/api/restaurants/cart', cartData)
        .subscribe(response => {
          console.log(response);
          this.router.navigate(['/cart']);
        });
    }
  }

  getcart() {
    // return [...this.cart];
    this.http.get<{ message: string, cart: any }>(
      'http://localhost:3000/api/restaurants/cart'
    )
      .pipe(map((cartData) => {
        return cartData.cart.map((cart) => {
          // console.log('service' + menu.restaurantID);
          return {
            restid: cart.restid,
            _id: cart._id,
            restname: cart.restname,
            orders: cart.orders
          };
        });
      }))
      .subscribe(TransformedData => {
        this.cart = TransformedData;
        this.cartUpdated.next([...this.cart]);
      });
  }

  getCartUpdateListener() {
    return this.cartUpdated.asObservable();
  }

  // getcartdetail() {
  //   // tslint:disable-next-line: max-line-length
  //   return this.http.get<{ _id: string, restid: string, orders: Array<string> }>(
  //     'http://localhost:3000/api/restaurants/cart'
  //   );
  // }

  deletePost(cartId: string) {
    this.http.put('http://localhost:3000/api/restaurants/cart/' + cartId, '')
      .subscribe(() => {
        this.cart.forEach((o) => {
          o.orders = o.orders.filter(s => s._id !== cartId);
        });
        //   const updatedCarts = this.cart.order.filter(post => {
        //     return (post.orders._id !== cartId);
        // }
        // );
        this.cartUpdated.next([...this.cart]);
      });
  }


  postorder(name: string, phone: string, address: string, restid: string, orders: Array<string>, restname: string) {
    console.log(orders);
    orders.forEach(element => {
      console.log(element);
    });
    const order = {
      name, phone, address, restid,
      orders, restname
    };
    this.http.post('http://localhost:3000/api/orders', order).subscribe(res => {
      console.log(res);
      this.http.delete('http://localhost:3000/api/restaurants/cart')
        .subscribe(response => {
          this.cart.pop();
          this.cartUpdated.next([...this.cart]);
        });
    });
  }

  getOrders() {
    this.http.get<{ message: string, orders: any }>(
      'http://localhost:3000/api/orders'
    )
      .pipe(map((cartData) => {
        return cartData.orders.map((order) => {
          // console.log('service' + menu.restaurantID);
          return {
            restid: order.restid,
            _id: order._id,
            restname: order.restname,
            orders: order.orders,
            info: order.info,
            status: order.status
          };
        });
      }))
      .subscribe(TransformedData => {
        this.order = TransformedData;
        this.orderUpdated.next([...this.order]);
      });
  }

  getorderUpdateListener() {
    return this.orderUpdated.asObservable();
  }
}
