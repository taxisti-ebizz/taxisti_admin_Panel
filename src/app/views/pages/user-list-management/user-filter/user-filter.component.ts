import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

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
  device_types : any = [];
  verify_data : any = [];
  disabled = false;

  constructor(public dialogRef: MatDialogRef<UserFilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder : FormBuilder) { }

  ngOnInit() {
    this.device_types = [
        { device_id: 'A', device_type: 'Android' },
        { device_id: 'I', device_type: 'IOS' },
    ];

    this.verify_data = [
      { verify_id: '1', verify: 'Approved' },
      { verify_id: '0', verify: 'Unapproved' },
    ];

    this.dropdownDeviceSettings = {
      singleSelection: false,
      idField: 'device_id',
      textField: 'device_type',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: false
    };

    this.dropdownVerifySettings = {
      singleSelection: false,
      idField: 'verify_id',
      textField: 'verify',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: false
    };

    this.userFilterForm = this.formBuilder.group({
      username : [''],
      mobile : [''],
      device_type : [''],
      verify : [''],
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
  }

  applyFilter(formData){
    console.log("FormData =====>>>>>",formData);
    
  }

  onItemSelectVerify(event){

  }

  onItemSelectDevice(event){

  }

}
