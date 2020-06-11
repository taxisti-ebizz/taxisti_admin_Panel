import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

// Service
import { NoDriverAvailableDataService } from '../../../../../services/ride/no-driver-available-data.service';


@Component({
  selector: 'kt-no-driver-available-filter',
  templateUrl: './no-driver-available-filter.component.html',
  styleUrls: ['./no-driver-available-filter.component.scss']
})
export class NoDriverAvailableFilterComponent implements OnInit {

    noDriverAvailbleFilterForm : FormGroup;

    viewLoading : true;
    loading = false;
    disabled = false;
    hasFormErrors = false;

    constructor(public dialogRef: MatDialogRef<NoDriverAvailableFilterComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private formBuilder : FormBuilder,
      private noDriverAvailableDataService : NoDriverAvailableDataService) { }

    ngOnInit() {

      this.noDriverAvailbleFilterForm = this.formBuilder.group({
        rider_name : [''],
        mobile : [''],
        location : [''],
        created_date : ['']
      })

      if(this.noDriverAvailableDataService.mode == 4){
        this.noDriverAvailbleFilterForm.patchValue(this.noDriverAvailableDataService.formData);
      }

    }

    //Apply Filter
    applyFilter(formData){

      var created_date = (<HTMLInputElement>document.getElementById('created_date')).value;
          created_date = ""+created_date.toString()+"";
  
      var createdDate = created_date.replace(/\s+-/g, '');
      
      const data = {  
          "rider_name" : formData.rider_name,
          "mobile" : formData.mobile,
          "location" : formData.location,
          "created_date" : createdDate
      }  
      
      localStorage.setItem('notAvailRidesFilter',JSON.stringify(data));
      this.dialogRef.close();
    }

    //Reset Form
    resetForm(){
      (<HTMLInputElement>document.getElementById('created_date')).value = '';
      this.noDriverAvailbleFilterForm.reset();
    }

    //Close Form
    closeForm(){
      this.noDriverAvailableDataService.formData = this.noDriverAvailbleFilterForm.value;
    }
}
