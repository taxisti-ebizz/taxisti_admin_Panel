import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'kt-driver-filter',
  templateUrl: './driver-filter.component.html',
  styleUrls: ['./driver-filter.component.scss']
})
export class DriverFilterComponent implements OnInit {

    driverFilterForm : FormGroup;

    viewLoading : true;
    loading = false;

    dropdownDeviceSettings: any = {}; // Used For Device Dropdown Settings
    dropdownVerifySettings : any = {}; // Used For Verify Dropdown Settings
    device_types : any = [];
    verify_data : any = [];
    disabled = false;
    hasFormErrors = false;

    constructor(public dialogRef: MatDialogRef<DriverFilterComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private formBuilder : FormBuilder) {
      }

    ngOnInit() {
      //Device Type Array 
      this.device_types = [
        { device_id: 'A', device_type: 'Android' },
        { device_id: 'I', device_type: 'IOS' },
      ];

      //Verify Array 
      this.verify_data = [
        { verify_id: '1', verify: 'Approved' },
        { verify_id: '2', verify: 'Unapproved' },
      ];

      //Multiple Device Type Settings
      this.dropdownDeviceSettings = {
        singleSelection: false,
        idField: 'device_id',
        textField: 'device_type',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 3,
        allowSearchFilter: false
      };

      //Multiple Verify Settings
      this.dropdownVerifySettings = {
        singleSelection: false,
        idField: 'verify_id',
        textField: 'verify',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 3,
        allowSearchFilter: false
      };
      
      //Driver Filter Form
      this.driverFilterForm = this.formBuilder.group({
        username : [''],
        mobile : [''],
        device_type : [''],
        verify : [''],
        dob : [''],
        dor : [''],
        min_rides : [''],
        max_rides : [''],
        min_cancelled : [''],
        max_cancelled : [''],
        min_acceptance : [''],
        max_acceptance : [''],
        min_rejected : [''],
        max_rejected : [''],
        min_last_week : [''],
        max_last_week : [''],
        min_current_week : [''],
        max_current_week : [''],
        min_total_hours : [''],
        max_total_hours : [''],
        min_total_reviews : [''],
        max_total_reviews : [''],
        min_average : [''],
        max_average : ['']
      })
    }

    //Apply Filter
    applyFilter(formData){

      // if(formData.username=='' && formData.mobile=='' && formData.dor=='' && formData.dob=='' && formData.device_type=='' && formData.verify=='' && 
      // (formData.min_rides=='' || formData.max_rides=='') && 
      // (formData.min_cancelled=='' || formData.max_cancelled=='') &&
      // (formData.min_total=='' || formData.max_total=='') &&
      // (formData.min_average=='' || formData.max_average=='') &&
      // (formData.min_rejected=='' || formData.max_rejected=='') &&
      // (formData.min_acceptance=='' || formData.max_acceptance=='') &&
      // (formData.min_last_week=='' || formData.max_last_week=='') &&
      // (formData.min_current_week=='' || formData.max_current_week=='') &&
      // (formData.min_total_hours=='' || formData.max_total_hours=='')){
      //   this.hasFormErrors = true;
      //   return;
      // }
      // else{

        var dob = (<HTMLInputElement>document.getElementById('dob')).value;
        dob = ""+dob.toString()+"";
    
        var dateOfBirth = dob.replace(/\s+-/g, '');
    
        var dor = (<HTMLInputElement>document.getElementById('dor')).value;
        dor = ""+dor.toString()+"";
    
        var dateOfRegister = dor.replace(/\s+-/g, '');
    
        var verifyData = '';
        for (let i = 0; i < formData.verify.length; i++) {
          if(verifyData!=''){
            verifyData += ',';
          }
          verifyData += formData.verify[i].verify_id;
        }
    
        var deviceData = '';
        for (let i = 0; i < formData.device_type.length; i++) {
          if(deviceData!=''){
            deviceData += ',';
          }
          deviceData += formData.device_type[i].device_id;
        }

       
        const data = {
          "username" : formData.username,
          "mobile" : formData.mobile,
          "dob" : dateOfBirth,
          "dor" : dateOfRegister,
          "device_type" : deviceData,
          "verify" : verifyData,
          "driver_rides" : formData.min_rides!=''?formData.min_rides+'-'+formData.max_rides:'',
          "driver_cancel_ride" : formData.min_cancelled!=''?formData.min_cancelled+'-'+formData.max_cancelled:'',
          "driver_total_review" : formData.min_total_reviews!=''?formData.min_total_reviews+'-'+formData.max_total_reviews:'',
          "driver_avg_rating" : formData.min_average!=''?formData.min_average+'-'+formData.max_average:'',
          "rejected_ratio"  : formData.min_rejected!=''?formData.min_rejected+'-'+formData.max_rejected:'',
          "acceptance_ratio" : formData.min_acceptance!=''?formData.min_acceptance+'-'+formData.max_acceptance:'',
          "online_hours_last_week" : formData.min_last_week!=''?formData.min_last_week+'-'+formData.max_last_week:'',
          "online_hours_current_week" : formData.min_current_week!=''?formData.min_current_week+'-'+formData.max_current_week:'',
          "total_online_hours" : formData.min_total_hours!=''?formData.min_total_hours+'-'+formData.max_total_hours:''
        } 
    
        localStorage.setItem('driverFilter',JSON.stringify(data));
        this.dialogRef.close(true);
      // }

    }

    onAlertClose(){
      this.hasFormErrors = false;
    }

    //Reset Form
    resetForm(){
      (<HTMLInputElement>document.getElementById('dob')).value = '';
      (<HTMLInputElement>document.getElementById('dor')).value = '';
      this.driverFilterForm.reset();
    }
}
