import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
//Http API Method
import { HttpService } from '../../../../../services/http.service';

//API Service
import { ApiService } from '../../../../../services/api.service';

//All Driver Data Service
import { CurDriverDataService } from '../../../../../services/driver/cur-driver-data.service';

// Services
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';


import { Store } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';

// Models
import { UserDeleted, User } from '../../../../../core/auth';

//Operators
import { finalize, takeUntil, tap } from 'rxjs/operators';

import { DatePipe } from '@angular/common'; // Used for changed date format

declare var $ : any;

@Component({
    selector: 'kt-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

    // Public properties
    editDriverForm: FormGroup; // Edit Driver Form Group
    hasFormErrors = false; // For display error
    viewLoading = false; // View Loader on screen
    loading = false; // View loader inside submit button

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

    maxDate : Date; //Set maximum date
    month: any; //Used for store datepicker month
    day: any; // Used for store datepicker days
    year: any; // Used for store datepicker year

    formControl = new FormControl('', [
        Validators.required
    ]); 

    constructor(public dialogRef : MatDialogRef<EditComponent>,
      @Inject(MAT_DIALOG_DATA) public data : any,
      private api : ApiService,
      private http : HttpService,
      private layoutUtilsService : LayoutUtilsService,
      private store : Store<AppState>,
      private curDriverDataService : CurDriverDataService,
      private datePipe : DatePipe) { }

    ngOnInit() {
        //Set max date into datepicker
        this.maxDate = new Date();

        this.maxDate.setDate( this.maxDate.getDate() );
        this.maxDate.setFullYear( this.maxDate.getFullYear() - 18 );
    }

    //Validate Form
    valid() { return this.formControl.hasError('required') ? 'Required field' : ''; }

    updateDriverDetails() {
      //this.spinner.show();

      this.loading = true;
      
      const editDriverFD = new FormData();
      editDriverFD.append('driver_id',this.data.driver.user_id);
      editDriverFD.append('first_name',this.data.driver.first_name);
      editDriverFD.append('last_name',this.data.driver.last_name);
      editDriverFD.append('date_of_birth',this.changeDateFormat(this.data.driver.date_of_birth));
      editDriverFD.append('car_brand',this.data.driver.car_brand);
      editDriverFD.append('car_year',this.data.driver.car_year);
      editDriverFD.append('plate_no',this.data.driver.plate_no);
      editDriverFD.append('profile_pic',this.profile_img);
      editDriverFD.append('licence',this.lic_img);

      for  (var i =  0; i < this.car_img.length; i++)  {  
        editDriverFD.append("car_image[]", this.car_img[i]);
      } 

      this.http
			.postReqForVerify(this.api.editDriverDetail,editDriverFD)
			.pipe(
				tap(driver => {
					
					if (driver.status == true) {
              this.dialogRef.close();

            if(this.data.driver.date_of_birth != ''){
              this.data.driver.date_of_birth = this.changeDateFormat(this.data.driver.date_of_birth);
            }

            var profile_pic = (<HTMLInputElement>document.getElementById('profile_pic')).value;
            
            if(profile_pic!=''){
              this.data.driver.profile = profile_pic;
            }

            var licence = (<HTMLInputElement>document.getElementById('licence')).value;

            if(licence!=''){
              this.data.driver.licence = licence;
            }

            this.curDriverDataService.update(this.data);

					}
				}),
				finalize(() => {
					this.loading = false;
				})
			).subscribe();
    }

    changeDateFormat(myDate) {
      return this.datePipe.transform(myDate, 'yyyy-MM-dd');
    }

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
            this.car_img.push(evt.target.files[k]);    
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

                (<HTMLInputElement>document.getElementById('profile_pic')).value = filePath;

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

                
                (<HTMLInputElement>document.getElementById('licence')).value = filePath;


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

    submit() {
      // emppty stuff
    }

}
