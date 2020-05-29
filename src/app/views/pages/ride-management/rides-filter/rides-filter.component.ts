import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'kt-rides-filter',
  templateUrl: './rides-filter.component.html',
  styleUrls: ['./rides-filter.component.scss']
})
export class RidesFilterComponent implements OnInit {

    rideFilterForm : FormGroup;

    viewLoading : true;
    loading = false;

    dropdownDeviceSettings: any = {}; // Used For Device Dropdown Settings
    dropdownVerifySettings : any = {}; // Used For Verify Dropdown Settings
    device_types : any = [];
    verify_data : any = [];
    disabled = false;
    hasFormErrors = false;

    constructor(public dialogRef: MatDialogRef<RidesFilterComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private formBuilder : FormBuilder) { }

    ngOnInit() {
        //Driver Filter Form
        this.rideFilterForm = this.formBuilder.group({
            rider_name : [''],
            driver_name : [''],
            start_date : [''],
            end_date : [''],
            start_location : [''],
            end_location : [''],
            min_amount : [''],
            max_amount : [''],
            min_distance : [''],
            max_distance : ['']
        })
    }

    applyFilter(formData){

    }

}
