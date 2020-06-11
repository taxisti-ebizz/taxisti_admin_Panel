import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

// Service
import { ContactUsDataService } from '../../../../services/contact-us/contact-us-data.service';

@Component({
    selector: 'kt-contact-us-filter',
    templateUrl: './contact-us-filter.component.html',
    styleUrls: ['./contact-us-filter.component.scss']
})
export class ContactUsFilterComponent implements OnInit {

    contactUsFilterForm : FormGroup;

    viewLoading : true;
    loading = false;
    hasFormErrors = false;
    dropdownStatusSettings : any = {}; //Used For Status Setting  
    statusData  : any = [];
    disabled = false;
   
    constructor(public dialogRef: MatDialogRef<ContactUsFilterComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private formBuilder : FormBuilder,
      private contactUsDataService : ContactUsDataService) { }

    ngOnInit() {

      //Status Array 
      this.statusData = [
        { status_id: '1', status: 'Pending' },
        { status_id: '2', status: 'Seen' },
        { status_id: '3', status: 'Replied' },
      ];

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

      this.contactUsFilterForm = this.formBuilder.group({
        username : [''],
        message : [''],
        status : [''],
        date : ['']
      });

      if(this.contactUsDataService.mode == 4){
        this.contactUsFilterForm.patchValue(this.contactUsDataService.formData);
      }
    }

    //Apply Filter
    applyFilter(formData){

      var date = (<HTMLInputElement>document.getElementById('date')).value;
          date = ""+date.toString()+"";

      var applyDate = date.replace(/\s+-/g, '');

      var status_data = '';
      for (let i = 0; i < formData.status.length; i++) {
        if(status_data!=''){
          status_data += ',';
        }
        status_data += formData.status[i].status_id;
      }

      const data = {
        "username" : formData.username,
        "message" : formData.message,
        "status" : status_data,
        "date" : applyDate
      } 

      localStorage.setItem('contactUsFilter',JSON.stringify(data));
      this.dialogRef.close(true);
    }

    //Reset Form
    resetForm(){
      (<HTMLInputElement>document.getElementById('date')).value = '';
      this.contactUsFilterForm.reset();
    }

    //Close Form
    closeForm(){
      this.contactUsDataService.formData = this.contactUsFilterForm.value;
    }
} 
