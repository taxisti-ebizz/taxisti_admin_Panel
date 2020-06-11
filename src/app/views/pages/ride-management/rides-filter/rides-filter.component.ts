import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

// Service
import { PendingRideDataService } from '../../../../services/ride/pending-ride-data.service';
import { RunningRideDataService } from '../../../../services/ride/running-ride-data.service';
import { CompleteRideDataService } from '../../../../services/ride/complete-ride-data.service';
import { NoResponseRideDataService } from '../../../../services/ride/no-response-ride-data.service';
import { FakeRideDataService } from '../../../../services/ride/fake-ride-data.service';
import { CommonService } from '../../../../services/common.service';

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
    listType = '';

    constructor(public dialogRef: MatDialogRef<RidesFilterComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private formBuilder : FormBuilder,
      private commonService : CommonService,
      private pendingRideService : PendingRideDataService,
      private runningRideService : RunningRideDataService,
      private completeRideService : CompleteRideDataService,
      private noResponseRideService : NoResponseRideDataService,
      private fakeRideService : FakeRideDataService) {
        this.listType = localStorage.getItem('listType');
      }

    ngOnInit() {

        if(this.listType == 'completedRide'){
          (<HTMLInputElement>document.getElementById('rat_div')).style.display = "block";
        }else if(this.listType == 'fakeRide'){
          (<HTMLInputElement>document.getElementById('rat_div')).style.display = "block";
          (<HTMLInputElement>document.getElementById('ride_mob')).style.display = "block";
          (<HTMLInputElement>document.getElementById('driver_mob')).style.display = "block";
        }

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


        if(this.pendingRideService.mode == 4){
          this.rideFilterForm.patchValue(this.pendingRideService.formData);
        }else if(this.runningRideService.mode == 4){
          this.rideFilterForm.patchValue(this.runningRideService.formData);
        }else if(this.completeRideService.mode == 4 && this.listType=='completedRide'){
          this.rideFilterForm.patchValue(this.completeRideService.formData);

          var otherData = this.completeRideService.otherData;

          (<HTMLInputElement>document.getElementById('min_rider_rating')).value = otherData[0].min_rider_rating!=''?otherData[0].min_rider_rating.toString():'';
          (<HTMLInputElement>document.getElementById('max_rider_rating')).value = otherData[0].max_rider_rating!=''?otherData[0].max_rider_rating.toString():'';
          (<HTMLInputElement>document.getElementById('min_driver_rating')).value = otherData[0].min_driver_rating!=''?otherData[0].min_driver_rating.toString():'';
          (<HTMLInputElement>document.getElementById('max_driver_rating')).value = otherData[0].max_driver_rating!=''?otherData[0].max_driver_rating.toString():'';
        }else if(this.noResponseRideService.mode == 4){
          this.rideFilterForm.patchValue(this.noResponseRideService.formData);
        }else if(this.fakeRideService.mode == 4){
          this.rideFilterForm.patchValue(this.fakeRideService.formData);

          var otherData = this.fakeRideService.otherData;

          (<HTMLInputElement>document.getElementById('min_rider_rating')).value = otherData[0].min_rider_rating!=''?otherData[0].min_rider_rating.toString():'';
          (<HTMLInputElement>document.getElementById('max_rider_rating')).value = otherData[0].max_rider_rating!=''?otherData[0].max_rider_rating.toString():'';
          (<HTMLInputElement>document.getElementById('min_driver_rating')).value = otherData[0].min_driver_rating!=''?otherData[0].min_driver_rating.toString():'';
          (<HTMLInputElement>document.getElementById('max_driver_rating')).value = otherData[0].max_driver_rating!=''?otherData[0].max_driver_rating.toString():'';
          (<HTMLInputElement>document.getElementById('rider_mobile')).value = otherData[0].rider_mobile!=''?otherData[0].rider_mobile.toString():'';
          (<HTMLInputElement>document.getElementById('driver_mobile')).value = otherData[0].driver_mobile!=''?otherData[0].driver_mobile.toString():'';
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

        var data = {};
        if(this.listType=='completedRide'){
            data = {  
              "rider_name" : formData.rider_name,
              "driver_name" : formData.driver_name,
              "start_date" : startDate,
              "end_date" : endDate,
              "start_location" : formData.start_location,
              "end_location" : formData.end_location,
              "amount" : (formData.min_amount!='' && formData.min_amount!=null)?formData.min_amount+'-'+formData.max_amount:'',
              "distance" : (formData.min_distance!='' && formData.min_distance!=null)?formData.min_distance+'-'+formData.max_distance:'',
              "rider_rating" : (<HTMLInputElement>document.getElementById('min_rider_rating')).value!=''?(<HTMLInputElement>document.getElementById('min_rider_rating')).value+'-'+(<HTMLInputElement>document.getElementById('max_rider_rating')).value:'',
              "driver_rating" : (<HTMLInputElement>document.getElementById('min_driver_rating')).value!=''?(<HTMLInputElement>document.getElementById('min_driver_rating')).value+'-'+(<HTMLInputElement>document.getElementById('max_driver_rating')).value:''
            }
        }
        else if(this.listType=='fakeRide'){
          data = {  
            "rider_name" : formData.rider_name,
            "driver_name" : formData.driver_name,
            "rider_mobile" : (<HTMLInputElement>document.getElementById('rider_mobile')).value!=''?(<HTMLInputElement>document.getElementById('rider_mobile')).value:'',
            "driver_mobile" : (<HTMLInputElement>document.getElementById('driver_mobile')).value!=''?(<HTMLInputElement>document.getElementById('driver_mobile')).value:'', 
            "start_date" : startDate,
            "end_date" : endDate,
            "start_location" : formData.start_location,
            "end_location" : formData.end_location,
            "amount" : (formData.min_amount!='' && formData.min_amount!=null)?formData.min_amount+'-'+formData.max_amount:'',
            "distance" : (formData.min_distance!='' && formData.min_distance!=null)?formData.min_distance+'-'+formData.max_distance:'',
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
            "amount" : (formData.min_amount!='' && formData.min_amount!=null)?formData.min_amount+'-'+formData.max_amount:'',
            "distance" : (formData.min_distance!='' && formData.min_distance!=null)?formData.min_distance+'-'+formData.max_distance:''
          }  
        }
        

        localStorage.setItem('ridesFilter',JSON.stringify(data));
        this.dialogRef.close();
    }

    //Reset Form
    resetForm(){
      if(this.listType=='completedRide'){
        (<HTMLInputElement>document.getElementById('min_rider_rating')).value = '';
        (<HTMLInputElement>document.getElementById('max_rider_rating')).value = '';
        (<HTMLInputElement>document.getElementById('min_driver_rating')).value = '';
        (<HTMLInputElement>document.getElementById('max_driver_rating')).value = '';
        this.completeRideService.otherData = [];
      }
      else if(this.listType=='fakeRide'){
        (<HTMLInputElement>document.getElementById('min_rider_rating')).value = '';
        (<HTMLInputElement>document.getElementById('max_rider_rating')).value = '';
        (<HTMLInputElement>document.getElementById('min_driver_rating')).value = '';
        (<HTMLInputElement>document.getElementById('max_driver_rating')).value = '';
        (<HTMLInputElement>document.getElementById('rider_mobile')).value = '';
        (<HTMLInputElement>document.getElementById('driver_mobile')).value = '';
        this.fakeRideService.otherData = [];
      }
      
      this.rideFilterForm.reset();
    }

    //Close Form
    closeForm(){

      switch (this.commonService.type) {
        case 'pending':
          this.pendingRideService.formData = this.rideFilterForm.value;
        break;

        case 'running':
          this.runningRideService.formData = this.rideFilterForm.value;
        break;

        case 'completed':
          const data = {
            "min_rider_rating" : (<HTMLInputElement>document.getElementById('min_rider_rating')).value,
            "max_rider_rating" : (<HTMLInputElement>document.getElementById('max_rider_rating')).value,
            "min_driver_rating" : (<HTMLInputElement>document.getElementById('min_driver_rating')).value,
            "max_driver_rating" : (<HTMLInputElement>document.getElementById('max_driver_rating')).value,
          }

          this.completeRideService.otherData.push(data);
          this.completeRideService.formData = this.rideFilterForm.value;
        break;

        case 'autoCanceled':
          this.noResponseRideService.formData = this.rideFilterForm.value;
        break;

        case 'fakeRide':

          const fakeRideData = {
            "min_rider_rating" : (<HTMLInputElement>document.getElementById('min_rider_rating')).value,
            "max_rider_rating" : (<HTMLInputElement>document.getElementById('max_rider_rating')).value,
            "min_driver_rating" : (<HTMLInputElement>document.getElementById('min_driver_rating')).value,
            "max_driver_rating" : (<HTMLInputElement>document.getElementById('max_driver_rating')).value,
            "rider_mobile" : (<HTMLInputElement>document.getElementById('rider_mobile')).value,
            "driver_mobile" : (<HTMLInputElement>document.getElementById('driver_mobile')).value
          }

          this.fakeRideService.otherData.push(fakeRideData);

          this.fakeRideService.formData = this.rideFilterForm.value;
        break;
      }
    }
} 
