import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MenuService } from '../menu.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MenuData } from '../menu-data.model';

@Component({
  selector: 'app-add-menu',
  templateUrl: './add-menu.component.html',
  styleUrls: ['./add-menu.component.css']
})
export class AddMenuComponent implements OnInit {
  isLoading = false;
  private mode = 'create';
  private empId: string;
  private type: string;

  menu: MenuData;

  constructor(private menuService: MenuService, public route: ActivatedRoute) { }

  ngOnInit() {
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
        });
      } else {
        this.mode = 'create';
        this.empId = null;
      }
    });
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.menuService.postMenu(form.value.name, form.value.cost, form.value.meal);
    } else {
      this.menuService.updateMenu(this.empId, form.value.name, form.value.cost, form.value.meal);
    }
    // console.log(this.arr);
    // this.menuService.postMenu(form.value.name, form.value.cost, form.value.meal);
    form.resetForm();
  }

}
