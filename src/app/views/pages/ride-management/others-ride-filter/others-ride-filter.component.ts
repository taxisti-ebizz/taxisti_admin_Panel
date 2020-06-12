import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

//Services
import { CanceledRideDataService } from '../../../../services/ride/canceled-ride-data.service';

@Component({
  selector: 'kt-others-ride-filter',
  templateUrl: './others-ride-filter.component.html',
  styleUrls: ['./others-ride-filter.component.scss']
})
export class OthersRideFilterComponent implements OnInit {

    otherRideFilterForm : FormGroup;

    viewLoading : true;
    loading = false;

    dropdownCancelBySettings: any = {}; // Used For Device Dropdown Settings
    cancel_by : any = [];
    disabled = false;
    hasFormErrors = false;

    constructor(public dialogRef: MatDialogRef<OthersRideFilterComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private formBuilder : FormBuilder,
      private canceledRideService : CanceledRideDataService) { }

    ngOnInit() {

      //Device Type Array 
      this.cancel_by = [
          { cancelBy_id: 'A', cancel_by: 'Rider' },
          { cancelBy_id: 'I', cancel_by: 'Driver' },
      ];

      //Multiple Cancel By Settings
      this.dropdownCancelBySettings = {
        singleSelection: false,
        idField: 'cancelBy_id',
        textField: 'cancel_by',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 3,
        allowSearchFilter: false
      };

      //Ride Filter Form
      this.otherRideFilterForm = this.formBuilder.group({
        user_name : [''],
        driver_name : [''],
        user_mobile : [''],
        driver_mobile : [''],
        start_date : [''],
        end_date : [''],
        date_of_ride : [''],
        date_of_cancel : [''],
        start_location : [''],
        end_location : [''],
        min_amount : [''],
        max_amount : [''],
        cancel_by : ['']
      })

      if(this.canceledRideService.mode == 4){
        this.otherRideFilterForm.patchValue(this.canceledRideService.formData);
      }

    }

    //Apply Filter
    applyFilter(formData){

      console.log("formData =====>>>>",formData);
      

      var startDate = (<HTMLInputElement>document.getElementById('start_date')).value;
          startDate = ""+startDate.toString()+"";
      var start_date = startDate.replace(/\s+-/g, '');

      var endDate = (<HTMLInputElement>document.getElementById('end_date')).value;
          endDate = ""+endDate.toString()+"";
      var end_date = endDate.replace(/\s+-/g, '');

      var date_of_ride = (<HTMLInputElement>document.getElementById('date_of_ride')).value;
          date_of_ride = ""+date_of_ride.toString()+"";
      var dateOfRide = date_of_ride.replace(/\s+-/g, '');

      var date_of_cancel = (<HTMLInputElement>document.getElementById('date_of_cancel')).value;
          date_of_cancel = ""+date_of_cancel.toString()+"";
      var dateOfCancel = date_of_cancel.replace(/\s+-/g, '');

      
      if(formData.cancel_by!='' && formData.cancel_by!=null){
        var cancelByData = '';
        for (let i = 0; i < formData.cancel_by.length; i++) {
          if(cancelByData!=''){
            cancelByData += ',';
          }
          cancelByData += formData.cancel_by[i].cancelBy_id;
        }
      }

      const data = {
        "user_name" : formData.username,
        "driver_name" : (formData.driver_name!=null && formData.driver_name!='')?formData.driver_name:'',
        "driver_mobile" : (formData.driver_mobile!=null && formData.driver_mobile!='')?formData.driver_mobile:'',
        "user_mobile" : (formData.user_mobile!=null && formData.user_mobile!='')?formData.user_mobile:'',
        "start_date" : start_date,
        "end_date" : end_date,
        "start_location" : (formData.start_location!=null && formData.start_location!='')?formData.start_location:'',
        "end_location" : (formData.end_location!=null && formData.end_location!='')?formData.end_location:'',
        "amount" : (formData.min_amount!=null && formData.min_amount!='')?formData.min_amount+'-'+formData.max_amount:'',
        "date_of_ride" : dateOfRide,
        "date_of_cancel" : dateOfCancel,
        "cancel_by" : cancelByData,
      } 

      localStorage.setItem('ridesFilter',JSON.stringify(data));
      this.dialogRef.close(true);
    }

    //Reset Form
    resetForm(){
      (<HTMLInputElement>document.getElementById('start_date')).value = '';
      (<HTMLInputElement>document.getElementById('end_date')).value = '';
      (<HTMLInputElement>document.getElementById('date_of_ride')).value = '';
      (<HTMLInputElement>document.getElementById('date_of_cancel')).value = '';
      this.otherRideFilterForm.reset();
    }

    //Close Form
    closeForm(){
      this.canceledRideService.formData = this.otherRideFilterForm.value;
    }
}
