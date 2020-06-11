import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

// Service
import { PromotionUserDataService } from '../../../../../services/promotion/promotion-user-data.service';

@Component({
  selector: 'kt-promotion-user-filter',
  templateUrl: './promotion-user-filter.component.html',
  styleUrls: ['./promotion-user-filter.component.scss']
})
export class PromotionUserFilterComponent implements OnInit {

    promotionUserFilterForm : FormGroup;

    viewLoading : true;
    loading = false;
    hasFormErrors = false;
   

    constructor(public dialogRef: MatDialogRef<PromotionUserFilterComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private formBuilder : FormBuilder,
      private promotionUserDataService : PromotionUserDataService) { }

    ngOnInit() {

      this.promotionUserFilterForm = this.formBuilder.group({
        username : [''],
        mobile : [''],
        description : [''],
        apply_date : ['']
      });

      if(this.promotionUserDataService.mode == 4){
        this.promotionUserFilterForm.patchValue(this.promotionUserDataService.formData);
      }
    }

    //Apply Filter
    applyFilter(formData){

      var apply_date = (<HTMLInputElement>document.getElementById('apply_date')).value;
          apply_date = ""+apply_date.toString()+"";

      var applyDate = apply_date.replace(/\s+-/g, '');

      const data = {
        "username" : formData.username,
        "mobile" : formData.mobile,
        "description" : formData.description,
        "apply_date" : applyDate
      } 

      localStorage.setItem('promotionUserFilter',JSON.stringify(data));
      this.dialogRef.close(true);
    }

    //Reset Form
    resetForm(){
      (<HTMLInputElement>document.getElementById('apply_date')).value = '';
      this.promotionUserFilterForm.reset();
    }

    //Close Form
    closeForm(){
      this.promotionUserDataService.formData = this.promotionUserFilterForm.value;
    }

}
