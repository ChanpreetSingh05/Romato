import { Component, OnInit, OnDestroy } from '@angular/core';
import { Review } from '../review.model';
import { Subscription } from 'rxjs';
import { ReviewService } from '../review.service';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { RestaurantsService } from 'src/app/restaurants/restaurant.service';

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css']
})
export class ReviewListComponent implements OnInit, OnDestroy {
  reviews: Review[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  public parentID = '';
  userId: string;
  private reviewsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public reviewsService: ReviewService,
    public restaurantService: RestaurantsService,
    private authService: AuthService,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.parentID = this.restaurantService.getparentID();
    this.reviewsService.getReviews(this.postsPerPage, this.currentPage, this.parentID);
    this.userId = this.authService.getUserId();
    console.log(this.userId);
    this.reviewsSub = this.reviewsService
      .getReviewUpdateListener()
      .subscribe((reviewData: { reviews: Review[]; reviewCount: number }) => {
        this.isLoading = false;
        this.totalPosts = reviewData.reviewCount;
        this.reviews = reviewData.reviews;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.reviewsService.getReviews(this.postsPerPage, this.currentPage, this.parentID);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.reviewsService.deleteReview(postId).subscribe(() => {
      this.reviewsService.getReviews(this.postsPerPage, this.currentPage, this.parentID);
    });
  }

  ngOnDestroy() {
    this.reviewsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
