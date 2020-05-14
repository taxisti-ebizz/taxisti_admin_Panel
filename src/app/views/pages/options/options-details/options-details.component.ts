import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SubheaderService } from '../../../../core/_base/layout';

//Http API Method
import { HttpService } from '../../../../services/http.service';

//Ngx Spinner
import { NgxSpinnerService } from 'ngx-spinner';

//API Service
import { ApiService } from '../../../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'kt-options-details',
  templateUrl: './options-details.component.html',
  styleUrls: ['./options-details.component.scss']
})
export class OptionsDetailsComponent implements OnInit {

    optionsForm: FormGroup;
    loading = false;
    hasFormErrors = false;
    optionData = [];

    constructor(private api : ApiService, 
      private http : HttpService,
      private subheaderService: SubheaderService,
      private formBuilder: FormBuilder,
      private router: Router,
      private spinner : NgxSpinnerService) { }

    ngOnInit() {
       // Set title to page breadCrumbs
       this.subheaderService.setTitle('Option');

       this.optionsForm = this.formBuilder.group({
           status: ['', Validators.required],
           contact_us: ['', Validators.required],
           ride_charge: ['', Validators.required],
           radius: ['', Validators.required],
           Timer: ['', Validators.required],
           app_start_time: ['', Validators.required],
           app_close_time: ['', Validators.required],
           fake_end_trip_m: ['', Validators.required],
           start_trip_m: ['', Validators.required],
       });
 
       this.getOptionsDetail()
    }

    //Get Option Details    
    getOptionsDetail(){
      this.http.postReq(this.api.getOptionsDetail,{}).subscribe(res =>{
        const result : any = res;
        if(result.status == true){
          
          result.data.forEach(element => {
            this.optionData[element.option_name] = element.option_value;
          });

          this.optionsForm.patchValue(this.optionData);
          this.spinner.hide();
        }
      })
    }

    /**
     * Checking control validation
     *
     * @param controlName: string => Equals to formControlName
     * @param validationType: string => Equals to valitors name
     */
    isControlHasError(controlName: string, validationType: string): boolean {
      const control = this.optionsForm.controls[controlName];
      if (!control) {
        return false;
      }

      const result = control.hasError(validationType) && (control.dirty || control.touched);
      return result;
    }

    //Update Details
    updateDetails(formData){
      this.loading = true;
      
      this.http.postReq(this.api.updateOptions,formData).subscribe(res =>{
        const result : any = res;
        if(result.status == true){
          this.loading = false;
          this.getOptionsDetail();
          this.spinner.hide();
        }
      })
      
    }

}
