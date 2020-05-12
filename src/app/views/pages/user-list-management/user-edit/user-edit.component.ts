import { Component, OnInit, Inject, ViewChild, EventEmitter, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

// RxJS
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';

//Http API Method
import { HttpService } from '../../../../services/http.service';

//API Service
import { ApiService } from '../../../../services/api.service';

//Edit User Service
import { EditUserService } from '../../../../services/user/edit-user.service';

//Spinner
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from '../../../../services/user/data.service';

//Component
//import { UserListComponent } from '../user-list/user-list.component';

declare var $ : any;

@Component({
  selector: 'kt-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

    //@ViewChild(UserListComponent, {static : false}) userList: UserListComponent;
    //@Output() private allUserList = new EventEmitter<any>();

    editUserForm: FormGroup;
    hasFormErrors = false;
    viewLoading = false;
    loading = false;

    form = new FormData();
    profile_img: File = null;


    //Upload Profile Pic
    error_file = false;
    pImages = new FormArray([]);
    fileStream = [];
    base64textString = [];
    certificates: any = [];
    getImages = false;
    certificateLength: number = 0;

    constructor(public dialogRef: MatDialogRef<UserEditComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private formBuilder : FormBuilder,
      private router: Router,
		  private http: HttpService,
      private api: ApiService,
      private editUserService : EditUserService,
      private spinner : NgxSpinnerService,
      public dataService: DataService) { }

    formControl = new FormControl('', [
      Validators.required
    ]);  

    ngOnInit() {
      this.editUserForm = this.formBuilder.group({
        user_id : [''],
        first_name : ['', Validators.required],
        last_name : ['',Validators.required]
      })

      this.editUserForm.reset();
      if (this.editUserService.mode === 2) {
          this.editUserForm.patchValue(this.editUserService.obj);
      }
    }

    //Update User
    // updateUser(formData) {
    //   //this.spinner.show();
    //   this.loading = true;
    //   this.hasFormErrors = false;
    //   const controls = this.editUserForm.controls;
    //   /** check form */
    //   if (this.editUserForm.invalid) {
    //     Object.keys(controls).forEach(controlName =>
    //       controls[controlName].markAsTouched()
    //     );

    //     this.hasFormErrors = true;
    //     return;
    //   }      

    //   const userFormdata = new FormData();
    //   userFormdata.append('user_id',formData.user_id);
    //   userFormdata.append('first_name',formData.first_name);
    //   userFormdata.append('last_name',formData.last_name);
    //   userFormdata.append('profile_pic',this.profile_img);

    //   this.http
		// 	.postReqForVerify(this.api.editUserDetails,userFormdata)
		// 	.pipe(
		// 		tap(user => {
					
		// 			if (user.status == true) {
		// 				  this.dialogRef.close();
		// 			}
		// 		}),
		// 		finalize(() => {
		// 			this.loading = false;
		// 		})
		// 	).subscribe();

    // }

    //Validate Form
    valid() { return this.formControl.hasError('required') ? 'Required field' : ''; }

    //Upload Certificate of incorporation
    onUploadChange(evt) {

      if (evt.target.files.length < 0) {
        this.error_file = true;
        return false;
      }
      else {
        this.error_file = false;
      }

      if (evt.target.files && evt.target.files[0]) {
        this.profile_img = <File>evt.target.files[0];
        var filesAmount = evt.target.files.length;

        var j = 0;
        for (let i = 0; i < filesAmount; i++) {	

          const extension = evt.target.files[i].name.substr(evt.target.files[i].name.lastIndexOf('.')).split('.');
          
          const ext = extension[1].toLowerCase();
        
          const fileName = evt.target.files[i].name;

          if (ext !== 'jpg' && ext !== 'jpeg' && ext !== 'png') {
           // this.toastr.error('not an accepted file extension');
            return false;
          }
          else {
            var reader = new FileReader();

            reader.readAsDataURL(evt.target.files[i]);
            reader.onload = (evt: any) => {
              var filePath = '';

              if (ext == 'jpg' || ext == 'jpeg' || ext == 'png') {
                filePath = evt.target.result;
              }
             
              $("#certificate").append("<div class=\"custImage\" style=\"float: left;display: inline-block;width: 100%;height: 150px;overflow: hidden;position: relative;padding: 8px;margin: 4px;border: 1px solid #eae6e6;\"><img class=\"imageThumb\" style=\"width: 100%;height: 100%;object-fit: cover;margin-bottom: 10px;\" src=\"" + filePath + "\" title=\"" + fileName + "\"/>" + "<br/><a href=\"javascript:void(0)\" class=\"remove\" style=\"color: #ff0000;position: absolute;top: 3px;right: 10px;font-size: 16px;\"><i class=\"fas fa-minus-circle\"></i></a></div>");

              (<HTMLInputElement>document.getElementById('profile_pic')).value = filePath;

              this.certificateLength = j;
              var self = this;
              $(".remove").click(function () {
                $(this).parent(".custImage").remove();
                self.base64textString.splice(i, 1);
                self.fileStream.splice(i, 1);
                (<FormArray>self.editUserForm.get('profile_pic')).removeAt(i);
                self.certificateLength -= 1;
              });

            }
          }

          j++;
        }
      }

      //this.urlStream(evt.target.files);
      // for (let i = 0; i < evt.target.files.length; i++) {

      //   const extension = evt.target.files[i].name.substr(evt.target.files[i].name.lastIndexOf('.')).split('.');
          
      //   const ext = extension[1].toLowerCase();

      //   if (ext !== 'jpg' && ext !== 'jpeg' && ext !== 'png') {
      //     //this.toastr.error('not an accepted file extension');
      //     return false;
      //   }
      //   else {
      //     const file = evt.target.files[i];
      //     this.fileStream.push(file);
          
      //     this.profile_img = file;
      //     this.form.append('profile_pic', evt.target.files[i]);
      //   }
      // }
    }

    //Get company images value
    getControlsValue() {
      return <FormArray>this.editUserForm.controls.profile_pic.value;
    }

    updateUser(): void {
      
      this.loading = true;

      const userFormdata = new FormData();
      userFormdata.append('user_id',this.data.user.user_id);
      userFormdata.append('first_name',this.data.user.first_name);
      userFormdata.append('last_name',this.data.user.last_name);
      userFormdata.append('profile_pic',this.profile_img);

      this.http
			.postReqForVerify(this.api.editUserDetails,userFormdata)
			.pipe(
				tap(user => {
					
					if (user.status == true) {
              this.dialogRef.close();

              var profile_pic = (<HTMLInputElement>document.getElementById('profile_pic')).value;

              if(profile_pic!=''){
                this.data.user.profile_pic = profile_pic;
              }

              this.dataService.updateIssue(this.data);

					}
				}),
				finalize(() => {
					this.loading = false;
				})
			).subscribe();
     
    }

    onNoClick(): void {
      this.dialogRef.close();
    }

    submit() {
      // emppty stuff
    }

}
