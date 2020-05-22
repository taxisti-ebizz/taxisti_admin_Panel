import { Component, OnInit } from '@angular/core';

//Forms
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

//Services
import { ApiService } from '../../../../services/api.service';
import { HttpService } from '../../../../services/http.service';
import { SubheaderService } from '../../../../core/_base/layout';

//Ngx Spinner
import { NgxSpinnerService } from 'ngx-spinner';
import { tap, finalize } from 'rxjs/operators';

//Toastr Message
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'kt-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  editProfileForm : FormGroup;
  loading = false;
  hasFormErrors = false;
  wrongPass = false; //Confirm Password not matched
  validPass = false; //Password length not valid
  pass = ''; //Store password value
  confirmPass = ''; // Store Confirm Password
  show: boolean = false; // Used For Hide/Show Password

  constructor(private formBuilder : FormBuilder,
      private api : ApiService, 
      private http : HttpService,
      private spinner: NgxSpinnerService,
      private subheaderService : SubheaderService,
      private toastr : ToastrService) { 

  }

  ngOnInit() {
    // Set title to page breadCrumbs
    this.subheaderService.setTitle('Admin Profile');

    this.editProfileForm = this.formBuilder.group({
      user_id : [''],
      name : ['', Validators.required],
      email_id : ['', Validators.required],
      mobile_no : ['', Validators.required]
    });

    this.editProfileForm.patchValue(JSON.parse(localStorage.getItem('userDetail')));
      
  }

  /**
   * Checking control validation
   *
   * @param controlName: string => Equals to formControlName
   * @param validationType: string => Equals to valitors name
   */
  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.editProfileForm.controls[controlName];
    
    if (!control) {
      return false;
    }

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
    
  }

  //Confirm Password
  cnfPass(cnfPass){
    var pass = (<HTMLInputElement>document.getElementById('pass')).value;
    this.pass = pass;
    this.confirmPass = cnfPass;

    if(cnfPass != pass){
      this.wrongPass = true;
      return false;
    }
    else{
      this.wrongPass = false;
    }
  }

  //Check Password
  checkPass(password){
    if(password.length < 8){
      this.validPass = true;
      return false;
    }
    else{
      this.validPass = false;
    }
  }

  //Update Profile Details
  updateDetails(formData){

    var data = {};
    var valid = 0;

    
    if(this.confirmPass!='' && this.pass!=''){

      if(this.confirmPass != this.pass){
        this.wrongPass = true;
        (<HTMLInputElement>document.getElementById("cpass")).focus();
        valid = 0;
        return false;
      }
      else{
        this.wrongPass = false;
        valid = 1;
      }  
    }
    
    if(valid == 1){
      data = {
        "user_id" : formData.user_id,
        "password" : this.pass!=''?this.pass:'',
        "name" : formData.name,
        "mobile_no" : formData.mobile_no,
      }
    }
    else{
      data = {
        "user_id" : formData.user_id,
        "name" : formData.name,
        "mobile_no" : formData.mobile_no,
      }
    }
    
    this.loading = true;
   
    this.http.postReq(this.api.updateAdminProfile,data)
    .pipe(
      tap(result => {
        if(result.status == true){
          this.toastr.success(result.message);
          this.spinner.hide();
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
