import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

// Service
import { PromotionDataService } from '../../../../../services/promotion/promotion-data.service';

@Component({
  selector: 'kt-promotion-filter',
  templateUrl: './promotion-filter.component.html',
  styleUrls: ['./promotion-filter.component.scss']
})
export class PromotionFilterComponent implements OnInit {

    promotionFilterForm : FormGroup;

    dropdownTypeSettings: any = {}; // Used For Type Dropdown Settings
    viewLoading : true;
    loading = false;
    disabled = false;
    hasFormErrors = false;
    types : any = [];
    
    constructor(public dialogRef: MatDialogRef<PromotionFilterComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private formBuilder : FormBuilder,
      private promotionDataService : PromotionDataService) { }

    ngOnInit() {

      //User Type Array 
      this.types = [
        { type_id: 'driver', type: 'Driver' },
        { type_id: 'rider', type: 'Rider' },
      ];

      //Multiple Types Settings
      this.dropdownTypeSettings = {
        singleSelection: false,
        idField: 'type_id',
        textField: 'type',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 3,
        allowSearchFilter: false
      };

      this.promotionFilterForm = this.formBuilder.group({
        type : [''],
        code : [''],
        min_user_limit : [''],
        max_user_limit : [''],
        start_date : [''],
        end_date : ['']
      });

      if(this.promotionDataService.mode == 4){
        this.promotionFilterForm.patchValue(this.promotionDataService.formData);
      }
    }

    //Apply Filter
    applyFilter(formData){

      var start_date = (<HTMLInputElement>document.getElementById('start_date')).value;
          start_date = ""+start_date.toString()+"";

      var startDate = start_date.replace(/\s+-/g, '');

      var end_date = (<HTMLInputElement>document.getElementById('end_date')).value;
          end_date = ""+end_date.toString()+"";

      var endDate = end_date.replace(/\s+-/g, '');

      var userTypeData = '';
      for (let i = 0; i < formData.type.length; i++) {
        if(userTypeData!=''){
          userTypeData += ',';
        }
        userTypeData += formData.type[i].type_id;
      }

      const data = {
        "type" : userTypeData,
        "code" : formData.code,
        "user_limit" : (formData.min_user_limit!=null && formData.min_user_limit!='')?formData.min_user_limit+'-'+formData.max_user_limit:'',
        "start_date" : startDate,
        "end_date" : endDate
      } 

      localStorage.setItem('promotionFilter',JSON.stringify(data));
      this.dialogRef.close(true);
    }

    //Reset Form
    resetForm(){
      (<HTMLInputElement>document.getElementById('start_date')).value = '';
      (<HTMLInputElement>document.getElementById('end_date')).value = '';
      this.promotionFilterForm.reset();
    }

    //Close Form
    closeForm(){
      this.promotionDataService.formData = this.promotionFilterForm.value;
    }
}
