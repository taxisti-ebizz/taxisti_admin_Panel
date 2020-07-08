import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

//Services
import { AllDriverDataService } from '../../../../services/driver/all-driver-data.service';
import { CurDriverDataService } from '../../../../services/driver/cur-driver-data.service';
import { OnlineDriverDataService } from '../../../../services/driver/online-driver-data.service';

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
    dropdownStatusSettings : any = {}; // Used For Status Dropdown Settings
    device_types : any = [];
    verify_data : any = [];
    status_data : any = [];
    disabled = false;
    hasFormErrors = false;

    constructor(public dialogRef: MatDialogRef<DriverFilterComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private formBuilder : FormBuilder,
      private allDriverDataService : AllDriverDataService,
      private curDriverDataService : CurDriverDataService,
      private onlineDriverDataService : OnlineDriverDataService) {
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

      //Status Array 
      this.status_data = [
        { status_id: '1', status: 'Active' },
        { status_id: '2', status: 'Inactive' },
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

      //Multiple Status Settings
      this.dropdownStatusSettings = {
        singleSelection: false,
        idField: 'status_id',
        textField: 'status',
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
        status : [''],
        dob : [''],
        dor : [''],
        min_rides : [''],
        max_rides : [''],
        min_cancelled : [''],
        max_cancelled : [''],
        min_total_reviews : [''],
        max_total_reviews : [''],
        min_average : [''],
        max_average : ['']
        //======================Commented BY VS 18-06-2020 7:09 PM============================
          // min_acceptance : [''],
          // max_acceptance : [''],
          // min_rejected : [''],
          // max_rejected : [''],
          // min_last_week : ['00:00'],
          // max_last_week : ['00:00'],
          // min_current_week : ['00:00'],
          // max_current_week : ['00:00'],
          // min_total_hours : ['00:00'],
          // max_total_hours : ['00:00'],
        //======================Commented BY VS 18-06-2020 7:09 PM============================
      })

      if(this.allDriverDataService.mode == 4){
        this.driverFilterForm.patchValue(this.allDriverDataService.formData);
      }

      if(this.curDriverDataService.mode == 4){
        this.driverFilterForm.patchValue(this.curDriverDataService.formData);
      }

      if(this.onlineDriverDataService.mode == 4){
        this.driverFilterForm.patchValue(this.onlineDriverDataService.formData);
      }
    }

    //Apply Filter
    applyFilter(formData){

    
        var dob = (<HTMLInputElement>document.getElementById('dob')).value;
        dob = ""+dob.toString()+"";
    
        var dateOfBirth = dob.replace(/\s+-/g, '');
    
        var dor = (<HTMLInputElement>document.getElementById('dor')).value;
        dor = ""+dor.toString()+"";
    
        var dateOfRegister = dor.replace(/\s+-/g, '');
    
        
        if(formData.verify!='' && formData.verify!=null){
          var verifyData = '';
          for (let i = 0; i < formData.verify.length; i++) {
            if(verifyData!=''){
              verifyData += ',';
            }
            verifyData += formData.verify[i].verify_id;
          }
        }
       
        if(formData.device_type!='' && formData.device_type!=null){
          var deviceData = '';
          for (let i = 0; i < formData.device_type.length; i++) {
            if(deviceData!=''){
              deviceData += ',';
            }
            deviceData += formData.device_type[i].device_id;
          }
        }

        if(formData.status!='' && formData.status!=null){
          var statusData = '';
          for (let i = 0; i < formData.status.length; i++) {
            if(statusData!=''){
              statusData += ',';
            }
            statusData += formData.status[i].status_id;
          }
        }  
       
        const data = {
          "username" : formData.username,
          "mobile" : formData.mobile,
          "dob" : dateOfBirth,
          "dor" : dateOfRegister,
          "device_type" : deviceData,
          "verify" : verifyData,
          "status" : statusData,
          "driver_rides" : (formData.min_rides!='' && formData.min_rides!=null)?formData.min_rides+'-'+formData.max_rides:'',
          "driver_cancel_ride" : (formData.min_cancelled!='' && formData.min_cancelled!=null)?formData.min_cancelled+'-'+formData.max_cancelled:'',
          "driver_total_review" : (formData.min_total_reviews!='' && formData.min_total_reviews!=null)?formData.min_total_reviews+'-'+formData.max_total_reviews:'',
          "driver_avg_rating" : (formData.min_average!='' && formData.min_average!=null)?formData.min_average+'-'+formData.max_average:''
        } 


        //=============================Commented BY VS 18-06-2020 7:09 PM======================================
          // "rejected_ratio"  : (formData.min_rejected!='' && formData.min_rejected!=null)?formData.min_rejected+'-'+formData.max_rejected:'',
          // "acceptance_ratio" : (formData.min_acceptance!='' && formData.min_acceptance!=null)?formData.min_acceptance+'-'+formData.max_acceptance:'',
          // "online_hours_last_week" : (formData.min_last_week!='00:00' && formData.min_last_week!=null)?formData.min_last_week+':00'+'-'+formData.max_last_week+':00':'',
          // "online_hours_current_week" : (formData.min_current_week!='00:00' && formData.min_current_week!=null)?formData.min_current_week+':00'+'-'+formData.max_current_week+':00':'',
          // "total_online_hours" : (formData.min_total_hours!='00:00' && formData.min_total_hours!=null)?formData.min_total_hours+':00'+'-'+formData.max_total_hours+':00':''
        //=============================Commented BY VS 18-06-2020 7:09 PM======================================
        

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
      if(this.allDriverDataService.type == 'all'){
        this.allDriverDataService.mode = 0;
        this.allDriverDataService.formData = {};
      }else if(this.curDriverDataService.type == 'current'){
        this.curDriverDataService.mode = 0;
        this.curDriverDataService.formData = {};
      }else if(this.onlineDriverDataService.type == 'online'){
        this.onlineDriverDataService.mode = 0;
        this.onlineDriverDataService.formData = {};
      }
      
     
    }

    //Close Form
    closeForm(){
      if(this.allDriverDataService.type == 'all'){
        this.allDriverDataService.formData = this.driverFilterForm.value;
      }else if(this.curDriverDataService.type == 'current'){
        this.curDriverDataService.formData = this.driverFilterForm.value;
      }else if(this.onlineDriverDataService.type == 'online'){
        this.onlineDriverDataService.formData = this.driverFilterForm.value;
      }
      
    }
} 
