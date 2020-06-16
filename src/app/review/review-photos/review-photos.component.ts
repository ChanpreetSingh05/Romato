import { Component, OnInit, OnDestroy } from '@angular/core';
import { Review } from '../review.model';
import { Subscription } from 'rxjs';
import { ReviewService } from '../review.service';
import { PageEvent } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-review-photos',
  templateUrl: './review-photos.component.html',
  styleUrls: ['./review-photos.component.css']
})
export class ReviewPhotosComponent implements OnInit, OnDestroy {
  reviews: Review[] = [];
  private reviewSub: Subscription;
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [10, 20, 50];
  parentID = '';
  constructor(public reviewService: ReviewService, public route: ActivatedRoute) { }

  ngOnInit(): void {
    // this.posts = this.postsService.getPosts();
    this.isLoading = true;
    this.parentID = this.route.parent.snapshot.paramMap.get('ID');
    this.reviewService.getReviews(this.postsPerPage, this.currentPage, this.parentID);
    this.reviewSub = this.reviewService
      .getReviewUpdateListener()
      .subscribe((reviewData: { reviews: Review[]; reviewCount: number }) => {
        this.isLoading = false;
        this.totalPosts = reviewData.reviewCount;
        this.reviews = reviewData.reviews;
      });
  }

  ngOnDestroy(): void {
    this.reviewSub.unsubscribe();
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.reviewService.getReviews(this.postsPerPage, this.currentPage, this.parentID);
  }

}
