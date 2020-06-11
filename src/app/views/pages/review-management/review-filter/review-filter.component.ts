import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

// Service
import { DriverReviewDataService } from '../../../../services/review/driver-review-data.service';
import { RiderReviewDataService } from '../../../../services/review/rider-review-data.service';
import { CommonService } from '../../../../services/common.service';

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
      private formBuilder : FormBuilder,
      private commonService : CommonService,
      private driverReviewDataService : DriverReviewDataService,
      private riderReviewDataService : RiderReviewDataService) { }

    ngOnInit() {

      this.reviewFilterForm = this.formBuilder.group({
          name : [''],
          mobile : [''],
          min_review : [''],
          max_review : [''],
          min_avg_rating : [''],
          max_avg_rating : ['']
      });

      if(this.driverReviewDataService.modeNum == 4){
        this.reviewFilterForm.patchValue(this.driverReviewDataService.formData);
      }else if(this.riderReviewDataService.modeNum == 4){
        this.reviewFilterForm.patchValue(this.riderReviewDataService.formData);
      }

    }

    //Apply Filter
    applyFilter(formData){

      const data = {  
        "name" : formData.name,
        "mobile" : formData.mobile,
        "review" : formData.min_review!=null?formData.min_review+'-'+formData.max_review:'',
        "avg_rating" : formData.min_avg_rating!=null?formData.min_avg_rating+'-'+formData.max_avg_rating:''
      }  
      
      localStorage.setItem('reviewsFilter',JSON.stringify(data));
      this.dialogRef.close();
    }

    //Reset Form
    resetForm(){
      this.reviewFilterForm.reset();
    }

    //Close Form
    closeForm(){

      console.log("hello ===>>>>",this.commonService.type);


      switch (this.commonService.type) {
        case 'driverReview':
          this.driverReviewDataService.formData = this.reviewFilterForm.value;
        break;

        case 'riderReview':
          console.log("hello");
          
          this.riderReviewDataService.formData = this.reviewFilterForm.value;
        break;
      }
    }    
}
