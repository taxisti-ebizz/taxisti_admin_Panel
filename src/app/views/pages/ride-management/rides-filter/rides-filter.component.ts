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
        //Ride Filter Form
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

    //Apply Filter
    applyFilter(formData){

        var start_date = (<HTMLInputElement>document.getElementById('start_date')).value;
            start_date = ""+start_date.toString()+"";
    
        var startDate = start_date.replace(/\s+-/g, '');
    
        var end_date = (<HTMLInputElement>document.getElementById('end_date')).value;
            end_date = ""+end_date.toString()+"";
    
        var endDate = end_date.replace(/\s+-/g, '');

        var data = {};
        if(localStorage.getItem('listType')=='completedRide'){
            data = {  
              "rider_name" : formData.rider_name,
              "driver_name" : formData.driver_name,
              "start_date" : startDate,
              "end_date" : endDate,
              "start_location" : formData.start_location,
              "end_location" : formData.end_location,
              "amount" : formData.min_amount!=''?formData.min_amount+'-'+formData.max_amount:'',
              "distance" : formData.min_distance!=''?formData.min_distance+'-'+formData.max_distance:'',
              "rider_rating" : (<HTMLInputElement>document.getElementById('min_rider_rating')).value!=''?(<HTMLInputElement>document.getElementById('min_rider_rating')).value+'-'+(<HTMLInputElement>document.getElementById('max_rider_rating')).value:'',
              "driver_rating" : (<HTMLInputElement>document.getElementById('min_driver_rating')).value!=''?(<HTMLInputElement>document.getElementById('min_driver_rating')).value+'-'+(<HTMLInputElement>document.getElementById('max_driver_rating')).value:''
            }
        }
        else if(localStorage.getItem('listType')=='fakeRide'){
          data = {  
            "rider_name" : formData.rider_name,
            "driver_name" : formData.driver_name,
            "rider_mobile" : (<HTMLInputElement>document.getElementById('rider_mobile')).value!=''?(<HTMLInputElement>document.getElementById('rider_mobile')).value:'',
            "driver_mobile" : (<HTMLInputElement>document.getElementById('driver_mobile')).value!=''?(<HTMLInputElement>document.getElementById('driver_mobile')).value:'', 
            "start_date" : startDate,
            "end_date" : endDate,
            "start_location" : formData.start_location,
            "end_location" : formData.end_location,
            "amount" : formData.min_amount!=''?formData.min_amount+'-'+formData.max_amount:'',
            "distance" : formData.min_distance!=''?formData.min_distance+'-'+formData.max_distance:'',
            "rider_rating" : (<HTMLInputElement>document.getElementById('min_rider_rating')).value!=''?(<HTMLInputElement>document.getElementById('min_rider_rating')).value+'-'+(<HTMLInputElement>document.getElementById('max_rider_rating')).value:'',
            "driver_rating" : (<HTMLInputElement>document.getElementById('min_driver_rating')).value!=''?(<HTMLInputElement>document.getElementById('min_driver_rating')).value+'-'+(<HTMLInputElement>document.getElementById('max_driver_rating')).value:''
          }
        }
        else{
           data = {  
            "rider_name" : formData.rider_name,
            "driver_name" : formData.driver_name,
            "start_date" : startDate,
            "end_date" : endDate,
            "start_location" : formData.start_location,
            "end_location" : formData.end_location,
            "amount" : formData.min_amount!=''?formData.min_amount+'-'+formData.max_amount:'',
            "distance" : formData.min_distance!=''?formData.min_distance+'-'+formData.max_distance:''
          }  
        }
        

        localStorage.setItem('ridesFilter',JSON.stringify(data));
        this.dialogRef.close();
    }

}
