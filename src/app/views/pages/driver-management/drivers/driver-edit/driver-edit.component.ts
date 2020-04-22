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

// Services
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../../../core/_base/crud';

import { Store } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';

// Models
import { UserDeleted, User } from '../../../../../core/auth';

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
    profile_img: File = null; //Store Profile Image
    car_img = []; // Store Car Image
    lic_img : File = null; // Store Licence Image
    requests : any = [];
    
    //Upload Profile Pic
    error_file = false;
    fileStream = [];
    base64textString = [];
    certificateLength: number = 0;
    
    constructor(public dialogRef: MatDialogRef<DriverEditComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private formBuilder : FormBuilder,
      private router: Router,
		  private http: HttpService,
      private api: ApiService,
      private editDriverService : EditDriverService,
      private layoutUtilsService: LayoutUtilsService,
      private store: Store<AppState>) { }

    ngOnInit() {
      this.editDriverForm = this.formBuilder.group({
        driver_id : [''],
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

    updateDriverDetails(formData) {
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

      const imgFormData = new FormData();
      imgFormData.append('driver_id',formData.driver_id);
      imgFormData.append('first_name',formData.first_name);
      imgFormData.append('last_name',formData.last_name);
      imgFormData.append('date_of_birth',formData.date_of_birth);
      imgFormData.append('car_brand',formData.car_brand);
      imgFormData.append('car_year',formData.car_year);
      imgFormData.append('plate_no',formData.plate_no);
      imgFormData.append('profile_pic',this.profile_img);
      imgFormData.append('licence',this.lic_img);
      imgFormData.append('car_image',this.requests);


      this.http.postReq(this.api.editDriverDetail,imgFormData).subscribe(res => {
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
    onUploadChange(evt,type) {

      if (evt.target.files.length < 0) {
        this.error_file = true;
        return false;
      }
      else {
        this.error_file = false;
      }

      if (evt.target.files && evt.target.files[0]) {
        if(type == 'profile'){
          this.profile_img = <File>evt.target.files[0];
        }
        else if(type == 'car'){
          ///this.car_img = <File>evt.target.files[0];

          for (let k = 0; k < evt.target.files.length; k++) {	
                //this.car_img.push(<File>evt.target.files[k]);
                this.requests.push(<File>evt.target.files[k]);    
          }
        }
        else{
          this.lic_img = <File>evt.target.files[0];
        }
        
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

              if(type == 'profile'){

                $("#certificate").append("<div class=\"custImage\" style=\"float: left;display: inline-block;width: 100%;height: 150px;overflow: hidden;position: relative;padding: 8px;margin: 4px;border: 1px solid #eae6e6;\"><img class=\"imageThumb\" style=\"width: 100%;height: 100%;object-fit: cover;margin-bottom: 10px;\" src=\"" + filePath + "\" title=\"" + fileName + "\"/>" + "<br/><a href=\"javascript:void(0)\" class=\"remove\" style=\"color: #ff0000;position: absolute;top: 3px;right: 10px;font-size: 16px;\"><i class=\"fas fa-minus-circle\"></i></a></div>");

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
              else if(type == 'car'){
                $("#displyCarImg").append("<div class=\"carImage\" style=\"float: left;display: inline-block;width: 100%;height: 150px;overflow: hidden;position: relative;padding: 8px;margin: 4px;border: 1px solid #eae6e6;\"><img class=\"imageThumb\" style=\"width: 100%;height: 100%;object-fit: cover;margin-bottom: 10px;\" src=\"" + filePath + "\" title=\"" + fileName + "\"/>" + "<br/><a href=\"javascript:void(0)\" class=\"remove\" style=\"color: #ff0000;position: absolute;top: 3px;right: 10px;font-size: 16px;\"><i class=\"fas fa-minus-circle\"></i></a></div>");

                this.certificateLength = j;
                var self = this;
                $(".remove").click(function () {
                  $(this).parent(".carImage").remove();
                  self.base64textString.splice(i, 1);
                  self.fileStream.splice(i, 1);
                  (<FormArray>self.editDriverForm.get('profile_pic')).removeAt(i);
                  self.certificateLength -= 1;
                });
              }
              else{
                $("#displyLicImg").append("<div class=\"licImage\" style=\"float: left;display: inline-block;width: 100%;height: 150px;overflow: hidden;position: relative;padding: 8px;margin: 4px;border: 1px solid #eae6e6;\"><img class=\"imageThumb\" style=\"width: 100%;height: 100%;object-fit: cover;margin-bottom: 10px;\" src=\"" + filePath + "\" title=\"" + fileName + "\"/>" + "<br/><a href=\"javascript:void(0)\" class=\"remove\" style=\"color: #ff0000;position: absolute;top: 3px;right: 10px;font-size: 16px;\"><i class=\"fas fa-minus-circle\"></i></a></div>");

                this.certificateLength = j;
                var self = this;
                $(".remove").click(function () {
                  $(this).parent(".licImage").remove();
                  self.base64textString.splice(i, 1);
                  self.fileStream.splice(i, 1);
                  (<FormArray>self.editDriverForm.get('profile_pic')).removeAt(i);
                  self.certificateLength -= 1;
                });
              }
              

            }
          }

          j++;
        }
      }

      //this.urlStream(evt.target.files);
      // for (let i = 0; i < evt.target.files.length; i++) {

      //   const extension = evt.target.files[i].name.substr(evt.target.files[i].name.lastIndexOf('.')).split('.');
          
      //   const ext = extension[1].toLowerCase();

      //   //this.companyDetailForm.controls['certificate_type'].setValue(ext);
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
      return <FormArray>this.editDriverForm.controls.profile_pic.value;
    }

    //Delete car images using Id
    deleteCarImg(_item : User){
        
        const _title = 'Delete Car Image';
        const _description = 'Are you sure to permanently delete this image?';
        const _waitDesciption = 'Car image is deleting...';
        const _deleteMessage = `Car image has been deleted`;
    
        const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption, _item, 'dltCarImg');
        dialogRef.afterClosed().subscribe(res => {
          if (!res) {
            return;
          }
    
          this.store.dispatch(new UserDeleted({ id: _item.id }));
          this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
          this.dialogRef.close(true);
      })
    }
}
