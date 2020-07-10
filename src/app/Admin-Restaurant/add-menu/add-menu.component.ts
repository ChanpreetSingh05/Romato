import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MenuService } from '../menu.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MenuData } from '../menu-data.model';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-add-menu',
  templateUrl: './add-menu.component.html',
  styleUrls: ['./add-menu.component.css']
})
export class AddMenuComponent implements OnInit {
  isLoading = false;
  private mode = 'create';
  public btn = 'Submit';
  public disableSelect = false;
  private empId: string;
  private type: string;
  form: FormGroup;
  imagePreview: string;

  menu: MenuData;

  constructor(private menuService: MenuService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, { validators: [Validators.required] }),
      cost: new FormControl(null, { validators: [Validators.required, Validators.min(1)] }),
      meal: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('ID')) {
        this.mode = 'edit';
        this.empId = paramMap.get('ID');
        this.type = paramMap.get('type');
        this.isLoading = true;
        this.menuService.getEditableMenu(this.empId, this.type).subscribe(postData => {
          this.isLoading = false;
          console.log(postData.name);
          if (this.type === 'breakfast' ) {
            this.menu = {
              _id: postData._id,
              name: postData.name,
              cost: postData.cost,
              type: 'Breakfast'
            };
          } else if (this.type === 'lunch' ) {
            this.menu = {
              _id: postData._id,
              name: postData.name,
              cost: postData.cost,
              type: 'Lunch'
            };
          } else {
            this.menu = {
              _id: postData._id,
              name: postData.name,
              cost: postData.cost,
              type: 'Dinner'
            };
          }
          this.form.setValue({
            name: this.menu.name,
            cost: this.menu.cost,
            meal: this.menu.type,
            image: ''
          });
          this.btn = 'Edit Menu';
          this.disableSelect = true;
        });
      } else {
        this.mode = 'create';
        this.empId = null;
        this.btn = 'Add Menu';
        this.disableSelect = false;
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

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.menuService.postMenu(this.form.value.name, this.form.value.cost, this.form.value.meal, this.form.value.image);
    } else {
      this.menuService.updateMenu(this.empId, this.form.value.name, this.form.value.cost, this.form.value.meal, this.form.value.image);
    }
    // console.log(this.arr);
    // this.menuService.postMenu(form.value.name, form.value.cost, form.value.meal);
    this.form.reset();
    this.isLoading = false;
  }

  // onSubmit(form: NgForm) {
  //   if (form.invalid) {
  //     return;
  //   }
  //   this.isLoading = true;
  //   if (this.mode === 'create') {
  //     this.menuService.postMenu(form.value.name, form.value.cost, form.value.meal);
  //   } else {
  //     this.menuService.updateMenu(this.empId, form.value.name, form.value.cost, form.value.meal);
  //   }
  //   // console.log(this.arr);
  //   // this.menuService.postMenu(form.value.name, form.value.cost, form.value.meal);
  //   form.resetForm();
  // }

}
