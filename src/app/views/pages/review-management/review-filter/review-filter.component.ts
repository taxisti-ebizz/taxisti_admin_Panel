import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
    selector: 'kt-review-filter',
    templateUrl: './review-filter.component.html',
    styleUrls: ['./review-filter.component.scss']
})
export class ReviewFilterComponent implements OnInit {

    reviewFilterForm : FormGroup;

    viewLoading : true;
    loading = false;
    disabled = false;
    hasFormErrors = false;

    constructor(public dialogRef: MatDialogRef<ReviewFilterComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private formBuilder : FormBuilder) { }

    ngOnInit() {

      this.reviewFilterForm = this.formBuilder.group({
          name : [''],
          mobile : [''],
          min_review : [''],
          max_review : [''],
          min_avg_rating : [''],
          max_avg_rating : ['']
      });

    }

    //Apply Filter
    applyFilter(formData){

      const data = {  
        "name" : formData.name,
        "mobile" : formData.mobile,
        "review" : formData.min_review!=''?formData.min_review+'-'+formData.max_review:'',
        "avg_rating" : formData.min_avg_rating!=''?formData.min_avg_rating+'-'+formData.max_avg_rating:''
      }  
      
      localStorage.setItem('reviewsFilter',JSON.stringify(data));
      this.dialogRef.close();
    }

}
