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
import { PageDataService } from '../../../../services/page/page-data.service';
import { tap, finalize } from 'rxjs/operators';


@Component({
  selector: 'kt-add-page',
  templateUrl: './add-page.component.html',
  styleUrls: ['./add-page.component.scss']
})
export class AddPageComponent implements OnInit {

    pageForm : FormGroup;

    name = 'ng2-ckeditor';
    ckeConfig: any;
    mycontent: string;
    log: string = '';
    @ViewChild("myckeditor", {static : true}) ckeditor: any;

    hasFormErrors = false;
    viewLoading = false;
    loading = false;

    constructor(public dialogRef: MatDialogRef<AddPageComponent>,
      @Inject(MAT_DIALOG_DATA) public data: Page,
      private api : ApiService, 
      private http : HttpService,
      private subheaderService: SubheaderService,
      private formBuilder: FormBuilder,
      private router: Router,
      private spinner : NgxSpinnerService,
      private pageDataService : PageDataService) { }

    ngOnInit() {
    
      this.ckeConfig = {
        allowedContent: false,
        extraPlugins: 'divarea',
        forcePasteAsPlainText: true
      };

      this.pageForm = this.formBuilder.group({
        page_title : ['',Validators.required],
        page_slug : ['',Validators.required],
        content : ['',Validators.required]
      })

    }

    addPage(formData){
      this.loading = true;  
    
      this.http
			.postReqForVerify(this.api.addPage,formData)
			.pipe(
				tap(result => {
					
					if (result.status == true) {
              this.dialogRef.close();

              this.pageDataService.add(this.data);
            
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

    /**
     * Checking control validation
     *
     * @param controlName: string => Equals to formControlName
     * @param validationType: string => Equals to valitors name
     */
    isControlHasError(controlName: string, validationType: string): boolean {
      const control = this.pageForm.controls[controlName];
      if (!control) {
        return false;
      }

      const result = control.hasError(validationType) && (control.dirty || control.touched);
      return result;
    }
}
