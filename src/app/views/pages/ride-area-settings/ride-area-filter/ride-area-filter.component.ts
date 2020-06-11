import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

// Service
import { RideAreaDataService } from '../../../../services/ride-area/ride-area-data.service';

@Component({
    selector: 'kt-ride-area-filter',
    templateUrl: './ride-area-filter.component.html',
    styleUrls: ['./ride-area-filter.component.scss']
})
export class RideAreaFilterComponent implements OnInit {

    rideAreaFilterForm : FormGroup;

    viewLoading : true;
    loading = false;
    disabled = false;
    hasFormErrors = false;

    constructor(public dialogRef: MatDialogRef<RideAreaFilterComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private formBuilder : FormBuilder,
      private rideAreaService : RideAreaDataService) { }

    ngOnInit() {

      this.rideAreaFilterForm = this.formBuilder.group({
          area_name : [''],
          created_date : ['']
      });

      if(this.rideAreaService.mode == 4){
        this.rideAreaFilterForm.patchValue(this.rideAreaService.formData);
      }

    }

    //Apply Filter
    applyFilter(formData){

      var date = (<HTMLInputElement>document.getElementById('created_date')).value;
          date = ""+date.toString()+"";
    
      var created_date = date.replace(/\s+-/g, '');

      const data = {  
        "area_name" : formData.area_name,
        "created_date" : created_date
      }  
      
      localStorage.setItem('rideAreaFilter',JSON.stringify(data));
      this.dialogRef.close();
    }

    //Close Form
    closeForm(){
      this.rideAreaService.formData = this.rideAreaFilterForm.value;
    }

    //Reset Form
    resetForm(){
      this.rideAreaFilterForm.reset();
    }
}
