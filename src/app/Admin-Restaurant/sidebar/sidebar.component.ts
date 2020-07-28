import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  userisAdmin: boolean;
  userisrest: boolean;
  private authListenerSubs: Subscription;
  private adminListenerSubs: Subscription;
  private restListenerSubs: Subscription;
  public userId: string;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userisrest = this.authService.getRest();
    this.userisAdmin = this.authService.getAdmin();

    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
    this.userId = this.authService.getUserId();

    this.adminListenerSubs = this.authService.getAdminListener().subscribe(isAdmin => {
      this.userisAdmin = isAdmin;
    });

    this.restListenerSubs = this.authService.getRestListener().subscribe(isrest => {
      this.userisrest = isrest;
    });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
    this.adminListenerSubs.unsubscribe();
    this.restListenerSubs.unsubscribe();
  }

}
