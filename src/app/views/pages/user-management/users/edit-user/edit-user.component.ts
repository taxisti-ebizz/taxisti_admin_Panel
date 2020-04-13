import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
//Http API Method
import { HttpService } from '../../../../../services/http.service';

//API Service
import { ApiService } from '../../../../../services/api.service';

//Edit User Service
import { EditUserService } from '../../../../../services/user/edit-user.service';

declare var $ : any;

@Component({
  selector: 'kt-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})

export class EditUserComponent implements OnInit {

    // Public properties
    //customer: CustomerModel;
    editUserForm: FormGroup;
    hasFormErrors = false;
    viewLoading = false;

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
    
    constructor(public dialogRef: MatDialogRef<EditUserComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private formBuilder : FormBuilder,
      private router: Router,
		  private http: HttpService,
      private api: ApiService,
      private editUserService : EditUserService) { }

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

    updateUser(formData) {
      //this.spinner.show();

      this.hasFormErrors = false;
      const controls = this.editUserForm.controls;
      /** check form */
      if (this.editUserForm.invalid) {
        Object.keys(controls).forEach(controlName =>
          controls[controlName].markAsTouched()
        );

        this.hasFormErrors = true;
        return;
      }      

      const userData = {
        "user_id" : formData.user_id,
        "first_name" : formData.first_name,
        "last_name" : formData.last_name,
        "profile_pic" : this.fileStream
      }

      this.http.postReq(this.api.editUserDetails,userData).subscribe(res => {
        const result : any = res;
        if(result.status == true){
          //this.toastr.success('Member updated successfully');
          
          this.dialogRef.close();
          //this.spinner.hide();
        }
      });
    }

    //Validate Form
    get valid() { return this.editUserForm.controls; }

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

              $("#certificate").append("<div class=\"custImage\" style=\"float: left;display: inline-block;width: 100px;height: 100px;overflow: hidden;position: relative;padding: 8px;margin: 4px;border: 1px solid #eae6e6;\"><img class=\"imageThumb\" style=\"width: 100%;height: 100%;object-fit: cover;margin-bottom: 10px;\" src=\"" + filePath + "\" title=\"" + fileName + "\"/>" + "<br/><a href=\"javascript:void(0)\" class=\"remove\" style=\"color: #ff0000;position: absolute;top: 3px;right: 10px;font-size: 16px;\"><i class=\"fas fa-minus-circle\"></i></a></div>");

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
      for (let i = 0; i < evt.target.files.length; i++) {

        const extension = evt.target.files[i].name.substr(evt.target.files[i].name.lastIndexOf('.')).split('.');
          
        const ext = extension[1].toLowerCase();

        //this.companyDetailForm.controls['certificate_type'].setValue(ext);
        if (ext !== 'jpg' && ext !== 'jpeg' && ext !== 'png') {
          //this.toastr.error('not an accepted file extension');
          return false;
        }
        else {
          const file = evt.target.files[i];
          this.fileStream.push(file);
          // if (file) {
          //   const reader = new FileReader();
          //   var category = 'certificate';
          //   reader.onload = this.handleOfficialDocReaderLoaded.bind(this, '', category, ext);
          console.log("file =======>>>>>>>",file);
            
          //this.editUserForm.get('profile_pic').setValue(file);
          this.profile_img = file;
          this.form.append('profile_pic', evt.target.files[i]);
        }
      }
    }

    //Get company images value
    getControlsValue() {
      return <FormArray>this.editUserForm.controls.profile_pic.value;
    }


  // // Handle uploaded file with extension
	// handleOfficialDocReaderLoaded(txt, category, ext, e) {

	// 	var dataType = '';
	// 	if (ext == 'jpg' || ext == 'jpeg' || ext == 'png') {
	// 		dataType = 'data:image/png;base64,';
  //   }
    
  //   this.base64textString.push(dataType + btoa(e.target.result));

  //   (<FormArray>this.editUserForm.get('profile_pic')).push(
  //     new FormGroup({
  //       base64string: new FormControl(dataType + btoa(e.target.result)),
  //     })
  //   );

  // }
  
  //Delete certificate
	deleteCertificate(i, id) {

		// this.http.deleteRequest(this.api.deleteCertificate + id).subscribe(res => {
		// 	const result: any = res;
		// 	if (result.status == 200) {
		// 		this.certificates.splice(i, 1);
		// 		this.certificateLength -= 1;
		// 		this.spinner.hide();
		// 	}
		// });
	}

}
