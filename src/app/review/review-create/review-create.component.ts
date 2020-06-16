import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { mimeType } from './mime-type.validator';
import { Review } from '../review.model';
import { ReviewService } from '../review.service';

@Component({
  selector: 'app-review-create',
  templateUrl: './review-create.component.html',
  styleUrls: ['./review-create.component.css']
})
export class ReviewCreateComponent implements OnInit {
  review: Review;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  parentID = '';
  private mode = 'create';
  private reviewId: string;

  constructor(
    public reviewsService: ReviewService,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('reviewId')) {
        this.mode = 'edit';
        this.reviewId = paramMap.get('reviewId');
        this.isLoading = true;
        this.reviewsService.getReview(this.reviewId).subscribe(reviewData => {
          this.isLoading = false;
          this.review = {
            id: reviewData._id,
            content: reviewData.content,
            imagePath: reviewData.imagePath,
            creator: reviewData.creator
          };
          this.form.setValue({
            content: this.review.content,
            image: this.review.imagePath
          });
        });
      } else {
        this.mode = 'create';
        this.parentID = this.route.parent.snapshot.paramMap.get('ID');
        this.reviewId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    console.log(file);
    console.log(this.form);
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavereview() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.reviewsService.addReview(
        this.form.value.content,
        this.form.value.image,
        this.parentID
      );
    } else {
      this.reviewsService.updateReview(
        this.reviewId,
        this.form.value.content,
        this.form.value.image
      );

    }
    this.form.reset();
    this.isLoading = false;
  }
}
