import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Review } from './review.model';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private reviews: Review[] = [];
  private reviewsUpdated = new Subject<{ reviews: Review[]; reviewCount: number }>();

  constructor(private http: HttpClient, private router: Router) { }

  getReviews(ReviewsPerPage: number, currentPage: number, parentID: string) {
    const queryParams = `?pagesize=${ReviewsPerPage}&page=${currentPage}&postID=${parentID}`;
    this.http
      .get<{ message: string; reviews: any; maxReviews: number }>(
        BACKEND_URL + '/reviews' + queryParams
      )
      .pipe(
        map(reviewData => {
          return {
            reviews: reviewData.reviews.map(review => {
              return {
                content: review.content,
                _id: review._id,
                imagePath: review.imagePath,
                creator: review.creator,
                postID: review.postID,
                name: review.name
              };
            }),
            maxReviews: reviewData.maxReviews
          };
        })
      )
      .subscribe(transformedReviewData => {
        this.reviews = transformedReviewData.reviews;
        this.reviewsUpdated.next({
          reviews: [...this.reviews],
          reviewCount: transformedReviewData.maxReviews
        });
      });
  }

  getReviewUpdateListener() {
    return this.reviewsUpdated.asObservable();
  }

  getReview(id: string) {
    return this.http.get<{
      _id: string;
      content: string;
      imagePath: string;
      creator: string;
      name: string;
    }>(BACKEND_URL + '/reviews/' + id);
  }

  addReview(content: string, image: File, postID: string) {
    const reviewData = new FormData();
    reviewData.append('content', content);
    reviewData.append('image', image, 'review');
    reviewData.append('postID', postID);
    this.http
      .post<{ message: string; review: Review }>(
        BACKEND_URL + '/reviews',
        reviewData
      )
      .subscribe(responseData => {
        this.reviews.push(responseData.review);
        this.reviewsUpdated.next({
          reviews: [...this.reviews],
          reviewCount: 1
        });
        console.log(this.reviews);
        console.log(responseData);
        this.router.navigate(['/']);
      });
  }

  updateReview(id: string, content: string, image: File | string) {
    // tslint:disable-next-line: prefer-const
    let reviewData: any | FormData;
    if (typeof image === 'object') {
      reviewData = new FormData();
      reviewData.append('id', id);
      reviewData.append('content', content);
      reviewData.append('image', image, 'review');
    } else {
      reviewData = {
        id,
        content,
        imagePath: image,
        creator: null,
        name: ''
      };
    }
    this.http
      .put(BACKEND_URL + '/reviews/' + id, reviewData)
      .subscribe(response => {
        console.log(response);
        this.router.navigate(['/']);
      });
  }

  deleteReview(postId: string) {
    return this.http
      .delete(BACKEND_URL + '/reviews/' + postId);
  }
}
