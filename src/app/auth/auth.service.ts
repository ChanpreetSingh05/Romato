import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AuthData } from './auth-data.model';
import { RestaurantsService } from '../restaurants/restaurant.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();
  private adminStatusListener = new Subject<boolean>();
  private restStatusListener = new Subject<boolean>();

  private userId: string;
  private restId: string;
  private booladmin = false;
  private Stringadmin: string;
  private boolrest = false;
  private Stringrest: string;

  constructor(private http: HttpClient, private router: Router, private rest: RestaurantsService) { }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUserId() {
    return this.userId;
  }

  getAdminListener() {
    return this.adminStatusListener.asObservable();
  }

  getAdmin() {
    return this.booladmin;
  }

  getRestListener() {
    return this.restStatusListener.asObservable();
  }

  getRest() {
    return this.boolrest;
  }

  createUser(email: string, password: string, id: string , isrest: boolean, isuser: boolean, name: string) {

    if (isrest === true && isuser === false ) {
      // tslint:disable-next-line: object-literal-shorthand
      const authData: AuthData = { email: email, password: password, restid: id, isrest: isrest, isuser: isuser, name: name };
      const menudata = {restid: id, name };
      this.http
        .post('http://localhost:3000/api/user/signup', authData)
        .subscribe(response => {
          this.http.post('http://localhost:3000/api/menu', menudata).subscribe(res => {
              this.rest.updateRestAccount(id, true );
          });
        });
    } else if (isrest === false && isuser === true ) {
      // tslint:disable-next-line: object-literal-shorthand
      const authData: AuthData = { email: email, password: password, restid: null , isrest: isrest, isuser: isuser, name: name };
      this.http
      .post('http://localhost:3000/api/user/signup', authData)
      .subscribe(response => {
        console.log(response);
      });
    }
  }

  login(email: string, password: string) {
    // tslint:disable-next-line: object-literal-shorthand
    const authData: any = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number; userId: string; isadmin: boolean ; isrest: boolean; isuser: boolean; restid: string }>(
        'http://localhost:3000/api/user/login',
        authData
      )
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.userId = response.userId;
          this.restId = response.restid;
          this.booladmin = response.isadmin;
          this.boolrest = response.isrest;
          console.log('edr' + this.restId);
          this.adminStatusListener.next(this.booladmin);
          this.restStatusListener.next(this.boolrest);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          if (this.booladmin === true) {
            this.Stringadmin = 'true';
            this.Stringrest = 'false';
            this.saveAuthData(token, expirationDate, this.userId, this.restId, this.Stringadmin, this.Stringrest);
            this.router.navigate(['/admin']);
          } else if (this.boolrest === true) {
            this.Stringrest = 'true';
            this.Stringadmin = 'false';
            this.saveAuthData(token, expirationDate, this.userId, this.restId, this.Stringadmin, this.Stringrest);
            this.router.navigate(['/rest-admin']);
          } else {
            this.Stringrest = 'false';
            this.Stringadmin = 'false';
            this.saveAuthData(token, expirationDate, this.userId, this.restId, this.Stringadmin, this.Stringrest);
            this.router.navigate(['/']);
          }
        }
      });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.restId = authInformation.restId;
      this.Stringadmin = authInformation.Sadmin;
      if (this.Stringadmin === 'true') {
        this.booladmin = true;
      } else {
        this.booladmin = false;
      }

      this.Stringrest = authInformation.Srest;
      if (this.Stringrest === 'true') {
        this.boolrest = true;
      } else {
        this.boolrest = false;
      }
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
      this.adminStatusListener.next(this.booladmin);
      this.restStatusListener.next(this.boolrest);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.adminStatusListener.next(false);
    this.restStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.userId = null;
    this.clearAuthData();
    this.router.navigate(['']);
  }

  private setAuthTimer(duration: number) {
    console.log('Setting timer: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string, restId: string, Stringadmin: string, Stringrest: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('restId', restId);
    localStorage.setItem('isadmin', Stringadmin);
    localStorage.setItem('isrest', Stringrest);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('restId');
    localStorage.removeItem('isadmin');
    localStorage.removeItem('isrest');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const restId = localStorage.getItem('restId');
    const Sadmin = localStorage.getItem('isadmin');
    const Srest = localStorage.getItem('isrest');

    if (!token || !expirationDate) {
      return;
    }
    return {
      // tslint:disable-next-line: object-literal-shorthand
      token: token,
      expirationDate: new Date(expirationDate),
      // tslint:disable-next-line: object-literal-shorthand
      userId: userId,
      // tslint:disable-next-line: object-literal-shorthand
      restId: restId,
      // tslint:disable-next-line: object-literal-shorthand
      Sadmin: Sadmin,
      // tslint:disable-next-line: object-literal-shorthand
      Srest: Srest
    };
  }
}
