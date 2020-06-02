import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

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
      private formBuilder : FormBuilder) { }

    ngOnInit() {

      this.noDriverAvailbleFilterForm = this.formBuilder.group({
        rider_name : [''],
        mobile : [''],
        location : ['']
      })

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

}
