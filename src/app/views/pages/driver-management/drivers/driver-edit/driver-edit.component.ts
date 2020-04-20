import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
//Http API Method
import { HttpService } from '../../../../../services/http.service';

//API Service
import { ApiService } from '../../../../../services/api.service';

//Edit Driver Service
import { EditDriverService } from '../../../../../services/driver/edit-driver.service';

declare var $ : any;

@Component({
  selector: 'kt-driver-edit',
  templateUrl: './driver-edit.component.html',
  styleUrls: ['./driver-edit.component.scss']
})
export class DriverEditComponent implements OnInit {

    // Public properties
    //customer: CustomerModel;
    editDriverForm: FormGroup;
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
    
    constructor(public dialogRef: MatDialogRef<DriverEditComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private formBuilder : FormBuilder,
      private router: Router,
		  private http: HttpService,
      private api: ApiService,
      private editDriverService : EditDriverService) { }

    ngOnInit() {
      this.editDriverForm = this.formBuilder.group({
        user_id : [''],
        first_name : ['', Validators.required],
        last_name : ['',Validators.required],
        date_of_birth : ['',Validators.required],
        car_brand : ['',Validators.required],
        car_year : ['',Validators.required],
        plate_no : ['',Validators.required],
      })

      this.editDriverForm.reset();
      if (this.editDriverService.mode === 2) {
          this.editDriverForm.patchValue(this.editDriverService.obj);
      }
    }

    updateUser(formData) {
      //this.spinner.show();

      this.hasFormErrors = false;
      const controls = this.editDriverForm.controls;
      /** check form */
      if (this.editDriverForm.invalid) {
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
    get valid() { return this.editDriverForm.controls; }

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
                (<FormArray>self.editDriverForm.get('profile_pic')).removeAt(i);
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
          //this.editUserForm.get('profile_pic').setValue(file);
          this.profile_img = file;
          this.form.append('profile_pic', evt.target.files[i]);
        }
      }
    }

    //Get company images value
    getControlsValue() {
      return <FormArray>this.editDriverForm.controls.profile_pic.value;
    }

    //Delete car images using Id
    deleteCarImg(driver_id){

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

}
