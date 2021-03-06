import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

//Data Service
import { DataService } from '../../../../services/user/data.service';

@Component({
  selector: 'kt-user-filter',
  templateUrl: './user-filter.component.html',
  styleUrls: ['./user-filter.component.scss']
})
export class UserFilterComponent implements OnInit {

  userFilterForm : FormGroup;

  viewLoading : true;
  loading = false;

  dropdownDeviceSettings: any = {}; // Used For Device Dropdown Settings
  dropdownVerifySettings : any = {}; // Used For Verify Dropdown Settings
  dropdownStatusSettings : any = {}; // Used For Status Dropdown Settings
  device_types : any = [];
  verify_data : any = [];
  status_data : any = [];
  disabled = false;

  constructor(public dialogRef: MatDialogRef<UserFilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder : FormBuilder,
    private dataService : DataService) { }

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

    //User Filter Form
    this.userFilterForm = this.formBuilder.group({
      username : [''],
      mobile : [''],
      device_type : [''],
      verify : [''],
      status : [''],
      dob : [''],
      dor : [''],
      min_completed : [''],
      max_completed : [''],
      min_cancelled : [''],
      max_cancelled : [''],
      min_total : [''],
      max_total : [''],
      min_average : [''],
      max_average : ['']
    })

    if(this.dataService.mode == 4){
      this.userFilterForm.patchValue(this.dataService.formData);
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

    var verifyData = '';
    for (let i = 0; i < formData.verify.length; i++) {
      if(verifyData!=''){
        verifyData += ',';
      }
      verifyData += formData.verify[i].verify_id;
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
      "complete_ride" : (formData.min_completed!='' && formData.min_completed!=null)?formData.min_completed+'-'+formData.max_completed:'',
      "cancelled_ride" : (formData.min_cancelled!='' && formData.min_cancelled!=null)?formData.min_cancelled+'-'+formData.max_cancelled:'',
      "total_review" : (formData.min_total!='' && formData.min_total!=null)?formData.min_total+'-'+formData.max_total:'',
      "average_ratting" : (formData.min_average!='' && formData.min_average!=null)?formData.min_average+'-'+formData.max_average:'',
      "dob" : dateOfBirth,
      "dor" : dateOfRegister,
      "device_type" : deviceData,
      "verify" : verifyData,
      "status" : statusData
    } 

    localStorage.setItem('userFilter',JSON.stringify(data));
    this.dialogRef.close(true);
  }

  //Reset Form
  resetForm(){
    (<HTMLInputElement>document.getElementById('dob')).value = '';
    (<HTMLInputElement>document.getElementById('dor')).value = '';
    this.userFilterForm.reset();
    this.dataService.mode = 0;
    this.dataService.formData = {};
  }

  //Close Form
  closeForm(){
    this.dataService.formData = this.userFilterForm.value;
  }
}
