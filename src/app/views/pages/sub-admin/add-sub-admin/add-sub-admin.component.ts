import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { SubheaderService } from '../../../../core/_base/layout';

//Http API Method
import { HttpService } from '../../../../services/http.service';

//Ngx Spinner
import { NgxSpinnerService } from 'ngx-spinner';

//API Service
import { ApiService } from '../../../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';

import { Page } from '../../../../module/page/page.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

//Page Data Service
import { SubAdminDataService } from '../../../../services/sub-admin/sub-admin-data.service';

import { tap, finalize } from 'rxjs/operators';

@Component({
  selector: 'kt-add-sub-admin',
  templateUrl: './add-sub-admin.component.html',
  styleUrls: ['./add-sub-admin.component.scss']
})
export class AddSubAdminComponent implements OnInit {

    subAdminForm : FormGroup;

    show: boolean = false; // Used For Hide/Show Password
    hasFormErrors = false;
    viewLoading = false;
    loading = false;
    submitted = false;

  constructor(public dialogRef: MatDialogRef<AddSubAdminComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Page,
    private api : ApiService, 
    private http : HttpService,
    private subheaderService: SubheaderService,
    private formBuilder: FormBuilder,
    private router: Router,
    private spinner : NgxSpinnerService,
    private subAdminDataService : SubAdminDataService) { }

  ngOnInit() {

    this.subAdminForm = this.formBuilder.group({
      name : ['',Validators.required],
      email_id : ['',[Validators.required,Validators.email]],
      password : ['',[Validators.required,Validators.minLength(8)]]
    })

  }

  // convenience getter for easy access to form fields
  get valid() { return this.subAdminForm.controls; }

  //Add Sub Admin
  addSubAdmin(formData){
    this.loading = true;  
    this.submitted = true;

    // stop here if form is invalid
    if (this.subAdminForm.invalid) {
        this.loading = false;
        return;
    }
    
    this.http
    .postReq(this.api.addSubAdmin,formData)
    .pipe(
      tap(result => {
        
        if (result.status == true) {
            this.dialogRef.close();
        }
        else {
          if (result.errors.code) { 
            this.hasFormErrors = true;
          }
        }
      }),
      finalize(() => {
        this.loading = false;
      })
    ).subscribe();
  }

  //Hide show password
  changePasswordType() {
      this.show = !this.show;
  }
}
