import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

//Http API Method
import { HttpService } from '../../../../services/http.service';

//API
import { ApiService } from '../../../../services/api.service';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { SubheaderService } from '../../../../core/_base/layout';

// Models
import { UserDeleted, User } from '../../../../core/auth';
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../../core/_base/crud';
// Services and Models
import {	ManyProductsDeleted } from '../../../../core/e-commerce';

// Service
import { ContactUsDataService } from '../../../../services/contact-us/contact-us-data.service';

//Component
import { ViewContactMessagesComponent } from '../view-contact-messages/view-contact-messages.component';

//Filter Component
import { ContactUsFilterComponent } from '../contact-us-filter/contact-us-filter.component';

//View User Details
import { ViewContactUserDetailComponent } from './../view-contact-user-detail/view-contact-user-detail.component';

import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
import { DataSource } from '@angular/cdk/collections';
import { ContactUs } from '../../../../module/contact-us/contact-us.module';
import { BehaviorSubject, fromEvent, Observable, merge } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';


@Component({
  selector: 'kt-contact-us-list',
  templateUrl: './contact-us-list.component.html',
  styleUrls: ['./contact-us-list.component.scss']
})
export class ContactUsListComponent implements OnInit {

    displayedColumns = ['id', 'name', 'message', 'status', 'created_date', 'actions'];

    exampleDatabase : ContactUsDataService | null;
    dataSource : ExampleDataSource | null;
    index: number;
    id: number;

    //dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild('filter', {static: true}) filter: ElementRef;

    page = 1
    pageSize = 10
    count = 0;

    constructor(private http: HttpService,
      private api: ApiService,
      private spinner: NgxSpinnerService,
      private subheaderService: SubheaderService,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private store: Store<AppState>,
      private httpClient : HttpClient,
      public contactUsDataService : ContactUsDataService) { }

    ngOnInit() {
      // Set title to page breadCrumbs
      this.subheaderService.setTitle('Contact Us');

      localStorage.setItem('contactUsFilter','');
      this.getContactUsData();
    }

    //Call Contact Us Datasource
    getContactUsData(){
      this.exampleDatabase = new ContactUsDataService(this.httpClient,this.spinner,this.http,this.api);
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
      this.contactUsDataService.page = event;
      this.dataSource.changePage(event);
    }

    /**
     * Delete Perticular Ride Area
    */
    deleteContact(contact_id){
      const _title = 'Delete Contact';
      const _description = 'Are you sure to permanently delete this contact?';
      const _waitDesciption = 'Contact is deleting...';
      const _deleteMessage = 'Contact has been deleted';

      const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption, contact_id, 'deleteContact');
      dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          return;
        }

        this.dataSource.deleteItem(contact_id)
            
        this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
      });
    } 

    //View Driver Review Details
    viewContactMessages(message){
      this.contactUsDataService.mode = 3;

      const dialogRef = this.dialog.open(ViewContactMessagesComponent, {
        width: '700px',
        height: 'auto',
        backdropClass: 'masterModalPopup',
        data: { mode: 3, messages : message }
      });
      dialogRef.afterClosed().subscribe(result => {
        
        if (result === false) {
          this.spinner.hide();
        }
      });
            
    }

    //View User Details
    viewUserDetails(user_id){

      const data = {
        "user_id" : user_id
      }

      this.http.postReq(this.api.getUserDetail,data).subscribe(res => {
        const result : any = res;
        if(result.status == true){

          this.spinner.hide();

          const dialogRef = this.dialog.open(ViewContactUserDetailComponent, {
            width: '700px',
            height: 'auto',
            backdropClass: 'masterModalPopup',
            data: { mode: 3, userData : result.data }
          });
          dialogRef.afterClosed().subscribe(result => {
            
            if (result === false) {
              this.spinner.hide();
            }
          });
        }
      })
      
    }

    //Apply Custom Filter
    applyCustomFilter(){

      const dialogRef = this.dialog.open(ContactUsFilterComponent, {
        width: '800px',
        height: 'auto',
        backdropClass: 'masterModalPopup',
        data: { mode : 3, title : 'Contact Us More Filter' },
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
      
        if(result != 3){
          this.dataSource.applyFilter();
        }
      });
    }
    
    //Clear Filter
    clearFilter(){
      localStorage.setItem('contactUsFilter','');
      this.dataSource.clearFilter();
    }
         
}

//DataSource ===============================
export class ExampleDataSource extends DataSource<ContactUs>{
  _filterChange = new BehaviorSubject('');

  pageSize = 10

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: ContactUs[] = [];
  renderedData: ContactUs[] = [];
  public totalContacts = 0;

  constructor(public exampleDatabase: ContactUsDataService,
              public paginator: MatPaginator,
              public sort: MatSort) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<ContactUs[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this.sort.sortChange,
      this._filterChange,
      //this.paginator.page
    ];

    this.exampleDatabase.getContactUsList(this.exampleDatabase.page);


    return merge(...displayDataChanges).pipe(map( (res) => {
        // Filter data

        this.totalContacts = this.exampleDatabase.total //result.total;

        this.filteredData =  this.exampleDatabase.data.slice().filter((issue: ContactUs) => {
          const searchStr = (issue.id + issue.name + issue.message + issue.status + issue.created_date).toLowerCase();
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
    this.exampleDatabase.getContactUsList(pageNumber);
  }

  /* Delete Item From List */
  deleteItem(index){
    this.exampleDatabase.deleteContact(index)
  }

  //Apply Filter
  applyFilter(){
    this.exampleDatabase.getContactUsList(this.exampleDatabase.page);
  }

  //Clear Filter
  clearFilter(){
    this.exampleDatabase.getContactUsList(this.exampleDatabase.page);
  }

  disconnect() {}

  /** Returns a sorted copy of the database data. */
  sortData(data: ContactUs[]): ContactUs[] {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string | Date = '';
      let propertyB: number | string | Date = '';
    

      switch (this.sort.active) {
        case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
        case 'name': [propertyA, propertyB] = [a.name, b.name]; break;
        case 'message': [propertyA, propertyB] = [a.message, b.message]; break;
        case 'status': [propertyA, propertyB] = [a.status, b.status]; break;
        case 'created_date': [propertyA, propertyB] = [a.created_date, b.created_date]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this.sort.direction === 'asc' ? 1 : -1);
    });
  }
}