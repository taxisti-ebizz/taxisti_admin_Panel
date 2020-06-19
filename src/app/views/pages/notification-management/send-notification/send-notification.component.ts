import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SubheaderService } from '../../../../core/_base/layout';

// Selection Model
import { SelectionModel } from '@angular/cdk/collections';

//Http API Method
import { HttpService } from '../../../../services/http.service';

//Ngx Spinner
import { NgxSpinnerService } from 'ngx-spinner';

//API Service
import { ApiService } from '../../../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';

//Toastr Messages
import { ToastrService } from 'ngx-toastr';

// Service
import { NotificationDataService } from '../../../../services/notification/notification-data.service';

import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
import { DataSource } from '@angular/cdk/collections';
import { Notification } from '../../../../module/notification/notification.module';
import { BehaviorSubject, fromEvent, Observable, merge } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { MatPaginator, MatSort } from '@angular/material';

declare var $ : any;

@Component({
  selector: 'kt-send-notification',
  templateUrl: './send-notification.component.html',
  styleUrls: ['./send-notification.component.scss']
})
export class SendNotificationComponent implements OnInit {

    notificationForm: FormGroup;
    loading = false;
    hasFormErrors = false;
    type = false;

    displayedColumns = ['select', 'user_name', 'user_type', 'mobile'];

    exampleDatabase : NotificationDataService | null;
    dataSource : ExampleDataSource | null;
    index: number;
    id: number;

    //dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild('filter', {static: true}) filter: ElementRef;

    constructor(private api : ApiService, 
      private http : HttpService,
      private subheaderService: SubheaderService,
      private formBuilder: FormBuilder,
      private router: Router,
      private spinner : NgxSpinnerService,
      private toastr : ToastrService,
      private httpClient : HttpClient,
      public notificationDataService : NotificationDataService) { }

  ngOnInit() {
    // Set title to page breadCrumbs
    this.subheaderService.setTitle('Notification Management');

    this.notificationForm = this.formBuilder.group({
        status: ['all', Validators.required],
        message: ['', Validators.required]
    });

    this.getSpecificUserList();
  }

  //Send Notification
  sendNotification(formData){

    this.loading = true;

    var data;

    if(formData.status == 'user'){

      var ids = '';
      
      for (let i = 0; i < this.dataSource.selection.selected.length; i++) {

        if(ids!=''){
          ids += ',';
        }
        ids += this.dataSource.selection.selected[i].id;
      }    

      data = {
        'to' : formData.status,
        'notification_message' : formData.message,
        'user_id' : ids
      }
    }else{
      data = {
        'to' : formData.status,
        'notification_message' : formData.message
      }
    }
    

    this.http.postReq(this.api.sendNotification,data).subscribe(res => {
      const result : any = res;
      if(result.status == true)
      {
        this.spinner.hide();
        this.loading = false;
        
        this.notificationForm.reset();
        this.dataSource.selection.clear();
        this.toastr.success('Notification has been send successfully.');
        this.notificationForm.get('status').setValue('all');
        (<HTMLDivElement>document.getElementById('specificUser')).hidden = true;
      }
      else{
        this.hasFormErrors = true;
        this.spinner.hide();
        this.toastr.error('Something went wrong');
      }
    })
  }

  //Checked Status
  checkStatus(){
    if(this.notificationForm.get('status').value=='user'){
      (<HTMLDivElement>document.getElementById('specificUser')).hidden = false;
    } 
    else{
      (<HTMLDivElement>document.getElementById('specificUser')).hidden = true;
      this.dataSource.selection.clear();
    }
  }

  /**
   * Checking control validation
   *
   * @param controlName: string => Equals to formControlName
   * @param validationType: string => Equals to valitors name
   */
  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.notificationForm.controls[controlName];
    if (!control) {
      return false;
    }

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  /** Alect Close event */
  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  //Get Specific UserData
  getSpecificUserList(){
    this.exampleDatabase = new NotificationDataService(this.httpClient,this.spinner,this.http,this.api);
    this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);
    // fromEvent(this.filter.nativeElement, 'keyup')
    // .subscribe(() => {
    //   if (!this.dataSource) {
    //     return;
    //   }
    //   this.dataSource.filter = this.filter.nativeElement.value;
    // })
  }

  //Driver list search filter
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //Handle Page
  handlePage(event){
    this.notificationDataService.page = event;
    this.dataSource.changePage(event);
  }

  /**
   * Check all rows are selected
  */
  isAllSelected() {
    const numSelected = this.dataSource.selection.selected.length;
    const numRows = this.dataSource.specificUserResult.length;
    return numSelected === numRows;
  }

  /**
   * Selects all rows if they are not all selected; otherwise clear selection
  */
  masterToggle() {
    if (this.isAllSelected()) {
      this.dataSource.selection.clear();
    } else {
      this.dataSource.specificUserResult.forEach(row => this.dataSource.selection.select(row));
    }
  }

}

//DataSource ===============================
export class ExampleDataSource extends DataSource<Notification>{
  _filterChange = new BehaviorSubject('');

  selection = new SelectionModel<Notification>(true, []);

  pageSize = 10

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: Notification[] = [];
  renderedData: Notification[] = [];
  specificUserResult: Notification[] = [];
  public totalUser = 0;

  constructor(public exampleDatabase: NotificationDataService,
              public paginator: MatPaginator,
              public sort: MatSort) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Notification[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this.sort.sortChange,
      this._filterChange,
      //this.paginator.page
    ];

    this.exampleDatabase.getSpecificUserList(this.exampleDatabase.page);

    return merge(...displayDataChanges).pipe(map( (res) => {
        // Filter data

        this.totalUser = this.exampleDatabase.total //result.total;
        this.specificUserResult = this.exampleDatabase.data;

        this.filteredData =  this.exampleDatabase.data.slice().filter((issue: Notification) => {
          const searchStr = (issue.id + issue.user_name + issue.user_type + issue.mobile).toLowerCase();
          return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
        });

        
        // Sort filtered data
        this.renderedData = this.sortData(this.filteredData.slice());
        
        return this.renderedData;
      }
    ));
  }

  

  /*Change Pagination and get next page data */
  changePage(pageNumber){
    this.exampleDatabase.getSpecificUserList(pageNumber);
  }

  disconnect() {}

  /** Returns a sorted copy of the database data. */
  sortData(data: Notification[]): Notification[] {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string | Date = '';
      let propertyB: number | string | Date = '';
    
      switch (this.sort.active) {
        case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
        case 'user_name': [propertyA, propertyB] = [a.user_name, b.user_name]; break;
        case 'user_type': [propertyA, propertyB] = [a.user_type, b.user_type]; break;
        case 'mobile': [propertyA, propertyB] = [a.mobile, b.mobile]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this.sort.direction === 'asc' ? 1 : -1);
    });
  }
}
