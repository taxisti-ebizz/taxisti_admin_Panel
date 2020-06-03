import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
    selector: 'kt-sub-admin-filter',
    templateUrl: './sub-admin-filter.component.html',
    styleUrls: ['./sub-admin-filter.component.scss']
})
export class SubAdminFilterComponent implements OnInit {

    subAdminFilterForm : FormGroup;

    viewLoading : true;
    loading = false;
    hasFormErrors = false;
   
    constructor(public dialogRef: MatDialogRef<SubAdminFilterComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private formBuilder : FormBuilder) { }

    ngOnInit() {
        this.subAdminFilterForm = this.formBuilder.group({
          name : [''],
          email_id : ['']
        });
    }

    //Apply Filter
    applyFilter(formData){
      localStorage.setItem('subAdminFilter',JSON.stringify(formData));
      this.dialogRef.close(true);
    }

    //Reset Form
    resetForm(){
      this.subAdminFilterForm.reset();
    }
}
