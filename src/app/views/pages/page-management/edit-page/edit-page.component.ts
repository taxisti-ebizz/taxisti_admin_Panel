import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

//API
import { ApiService } from '../../../../services/api.service';
import { HttpService } from '../../../../services/http.service';
import { PageDataService } from '../../../../services/page/page-data.service';
import { Page } from '../../../../module/page/page.module';

import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { tap, finalize } from 'rxjs/operators';

@Component({
  selector: 'kt-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit {

  //pageForm : FormGroup;

  hasFormErrors = false;
  viewLoading = false;
  loading = false;
  pageData : any

  name = 'ng2-ckeditor';
  ckeConfig: any;
  mycontent: string;
  log: string = '';
  @ViewChild("myckeditor", {static : true}) ckeditor: any;

  formControl = new FormControl('', [
    Validators.required
  ]);

  constructor(private dialogRef : MatDialogRef<EditPageComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any,
    private pageDataService : PageDataService,
    private formBuilder: FormBuilder,
    private api : ApiService,
    private http : HttpService) { }

  ngOnInit() {
    this.pageData = Page;

    this.ckeConfig = {
      allowedContent: false,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: true
    };
  }

  //Validate Form
  valid() { return this.formControl.hasError('required') ? 'Required field' : ''; }

  //Update Page Details
  updatePageDetails(){

    this.loading = true;  

    const updateData = new FormData();
    updateData.append('id',this.data.pageData.id);
    updateData.append('page_title',this.data.pageData.page_title);
    updateData.append('page_slug',this.data.pageData.page_slug);
    updateData.append('content',this.data.pageData.content);

    this.http
    .postReqForVerify(this.api.editPage,updateData)
    .pipe(
      tap(result => {
    
        if (result.status == true) {
            this.pageDataService.update(this.data);
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

}
