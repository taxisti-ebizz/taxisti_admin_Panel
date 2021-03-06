import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
//Http API Method
import { HttpService } from '../../../../services/http.service';

//API Service
import { ApiService } from '../../../../services/api.service';

//Promotion Data Service
import { PromotionDataService } from '../../../../services/promotion/promotion-data.service';

// Services
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';

import { Store } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';

//Operators
import { finalize, takeUntil, tap } from 'rxjs/operators';

import { DatePipe } from '@angular/common'; // Used for changed date format

declare var $ : any;

@Component({
  selector: 'kt-edit-promotion',
  templateUrl: './edit-promotion.component.html',
  styleUrls: ['./edit-promotion.component.scss']
})
export class EditPromotionComponent implements OnInit {

    editPromotionForm: FormGroup;

    hasFormErrors = false;
    viewLoading = false;
    loading = false;

    //Upload Profile Pic
    error_file = false;
    fileStream = [];
    base64textString = [];
    certificateLength: number = 0;

    form = new FormData();
    promo_img: File = null; //Store Profile Image

    formControl = new FormControl('', [
      Validators.required
    ]); 

    constructor(public dialogRef: MatDialogRef<EditPromotionComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private router: Router,
		  private http: HttpService,
      private api: ApiService,
      private layoutUtilsService: LayoutUtilsService,
      private store: Store<AppState>,
      private promotionDataService : PromotionDataService,
      private datePipe : DatePipe) { }

    ngOnInit() {
    }

    //Validate Form
    valid() { return this.formControl.hasError('required') ? 'Required field' : ''; }

    //Update Promotion Details
    updatePromotionDetails() {
      //this.spinner.show();

      this.loading = true;
      
      const updateData = new FormData();
      updateData.append('id',this.data.promoData.id);
      updateData.append('type',this.data.promoData.type);
      updateData.append('code',this.data.promoData.code);
      updateData.append('user_limit',this.data.promoData.user_limit);
      updateData.append('start_date',this.data.promoData.start_date);
      updateData.append('end_date',this.data.promoData.end_date);
      updateData.append('description',this.data.promoData.description);
      if(this.promo_img!=null){
        updateData.append('promo_image',this.promo_img);
      }
      
     
      this.http
			.postReqForVerify(this.api.updatePromotionDetail,updateData)
			.pipe(
				tap(driver => {
					
					if (driver.status == true) {
              this.dialogRef.close();

            if(this.data.promoData.start_date != ''){
              this.data.promoData.start_date = this.changeDateFormat(this.data.promoData.start_date);
            }

            if(this.data.promoData.end_date != ''){
              this.data.promoData.end_date = this.changeDateFormat(this.data.promoData.end_date);
            }

            var promo_pic = (<HTMLInputElement>document.getElementById('promo_pic')).value;

            if(promo_pic!=''){
              this.data.promoData.promo_image = promo_pic;
            }

            this.promotionDataService.update(this.data);
					}
				}),
				finalize(() => {
					this.loading = false;
				})
			).subscribe();
    }

    //Change Date Format
    changeDateFormat(myDate) {
      return this.datePipe.transform(myDate, 'yyyy-MM-dd');
    }

    //Upload Promotion Image
    onUploadChange(evt) {

      if (evt.target.files.length < 0) {
        this.error_file = true;
        return false;
      }
      else {
        this.error_file = false;
      }

      if (evt.target.files && evt.target.files[0]) {
        this.promo_img = <File>evt.target.files[0];
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
             
              $("#promo_image").append("<div class=\"custImage\" style=\"float: left;display: inline-block;width: 100%;height: 150px;overflow: hidden;position: relative;padding: 8px;margin: 4px;border: 1px solid #eae6e6;\"><img class=\"imageThumb\" style=\"width: 100%;height: 100%;object-fit: cover;margin-bottom: 10px;\" src=\"" + filePath + "\" title=\"" + fileName + "\"/>" + "<br/><a href=\"javascript:void(0)\" class=\"remove\" style=\"color: #ff0000;position: absolute;top: 3px;right: 10px;font-size: 16px;\"><i class=\"fas fa-minus-circle\"></i></a></div>");

              (<HTMLInputElement>document.getElementById('promo_pic')).value = filePath;

              this.certificateLength = j;
              var self = this;
              $(".remove").click(function () {
                $(this).parent(".custImage").remove();
                self.base64textString.splice(i, 1);
                self.fileStream.splice(i, 1);
                (<FormArray>self.editPromotionForm.get('promo_pic')).removeAt(i);
                self.certificateLength -= 1;
              });

            }
          }

          j++;
        }
      }
    }

    submit(){
      
    }
}
