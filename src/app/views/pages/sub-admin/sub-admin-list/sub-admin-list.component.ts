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
import { SubAdminDataService } from '../../../../services/sub-admin/sub-admin-data.service';

//Component
import { AddSubAdminComponent } from '../add-sub-admin/add-sub-admin.component';

//Filter Component
import { SubAdminFilterComponent } from '../sub-admin-filter/sub-admin-filter.component';

//View User Details
import { ViewSubAdminUserDetailComponent } from './../view-sub-admin-user-detail/view-sub-admin-user-detail.component';

import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
import { DataSource } from '@angular/cdk/collections';
import { SubAdmin } from '../../../../module/sub-admin/sub-admin.module';
import { BehaviorSubject, fromEvent, Observable, merge } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

//Toastr Messages
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'kt-sub-admin-list',
  templateUrl: './sub-admin-list.component.html',
  styleUrls: ['./sub-admin-list.component.scss']
})
export class SubAdminListComponent implements OnInit {

    displayedColumns = ['id', 'name', 'email', 'actions'];

    exampleDatabase : SubAdminDataService | null;
    dataSource : ExampleDataSource | null;
    index: number;
    id: number;
    pageData : any

    //dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild('filter', {static: true}) filter: ElementRef;
    
    constructor(private http: HttpService,
      private api: ApiService,
      private spinner: NgxSpinnerService,
      private subheaderService: SubheaderService,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private store: Store<AppState>,
      private httpClient : HttpClient,
      public subAdminDataService : SubAdminDataService,
      private toastr : ToastrService) { }

    ngOnInit() {
      // Set title to page breadCrumbs
      this.subheaderService.setTitle('Sub Admin');

      localStorage.setItem('subAdminFilter','');
      this.getSubAdminData();
    }

    //Get Sub Admin Data
    getSubAdminData(){
      this.exampleDatabase = new SubAdminDataService(this.httpClient,this.spinner,this.http,this.api);
      this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);
      // fromEvent(this.filter.nativeElement, 'keyup')
      // .subscribe(() => {
      //   if (!this.dataSource) {
      //     return;
      //   }
      //   this.dataSource.filter = this.filter.nativeElement.value;
      // })
    }

    //Page list search filter
    applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }

    //Handle Page
    handlePage(event){
      this.subAdminDataService.page = event;
      this.dataSource.changePage(event);
    }

    /*
      Add Sub Admin
    */
    addSubAdmin() {

      const dialogRef = this.dialog.open(AddSubAdminComponent, {
        width: '700px',
        height: 'auto',
        backdropClass: 'masterModalPopup',
        data: { page : this.pageData }
      });

      dialogRef.afterClosed().subscribe(result => {
        
        if(result != 2){
          // After dialog is closed we're doing frontend updates
          // For add we're just pushing a new row inside DataService
          this.exampleDatabase.dataChange.value.push(this.subAdminDataService.getDialogData());
          this.getSubAdminData();
        }
      });
    }  

    /**
     * Delete Sub Admin Data
    */
    deleteSubAdmin(sub_admin_id){
      const _title = 'Delete Sub Admin';
      const _description = 'Are you sure to permanently delete this sub admin?';
      const _waitDesciption = 'Sub admin is deleting...';
      const _deleteMessage = 'Sub admin has been deleted';

      const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption, sub_admin_id, 'deleteSubAdmin');
      dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          return;
        }

        this.dataSource.deleteItem(sub_admin_id)
            
        this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
      });
    } 

    // Active Inactive Sub Admin
    activeInactiveSubAdmin(user_id,type){
      
      var _title = '';
      var _description = '';
      var _waitDesciption = '';
      var _deleteMessage = '';
      if(type == 0){
        _title = 'Sub Admin Unapprove';
        _description = 'Are you sure want to Unapprove?';
        _waitDesciption = 'Sub admin is unapproving...';
        _deleteMessage = `Sub admin has been Unapproved`;
      }else{
        _title = 'Sub Admin Approve';
        _description = 'Are you sure want to Approve?';
        _waitDesciption = 'Sub admin is aprroving...';
        _deleteMessage = `Sub admin has been Approved`;
      }

      const dialogRef = this.layoutUtilsService.verifyElement(_title, _description, _waitDesciption, user_id, type, 'subAdmin');
      dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          return;
        }

        this.store.dispatch(new UserDeleted({ id: user_id }));
        this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);

        const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.user_id === user_id);
        this.exampleDatabase.dataChange.subscribe(res => {
          const result : any = res;
            result[foundIndex].status = type;
        });
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

          const dialogRef = this.dialog.open(ViewSubAdminUserDetailComponent, {
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
        else{
          this.spinner.hide();
          this.toastr.error('Something went wrong');
        }
      })
      
    }

    //Apply Custom Filter
    applyCustomFilter(){

      const dialogRef = this.dialog.open(SubAdminFilterComponent, {
        width: '800px',
        height: 'auto',
        backdropClass: 'masterModalPopup',
        data: { mode : 3, title : 'Sub Admin More Filter' },
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
      localStorage.setItem('subAdminFilter','');
      this.dataSource.clearFilter();
    }
}

//DataSource ===============================
export class ExampleDataSource extends DataSource<SubAdmin>{
  _filterChange = new BehaviorSubject('');

  pageSize = 10

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: SubAdmin[] = [];
  renderedData: SubAdmin[] = [];
  public totalSubAdmin = 0;

  constructor(public exampleDatabase: SubAdminDataService,
              public paginator: MatPaginator,
              public sort: MatSort) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<SubAdmin[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this.sort.sortChange,
      this._filterChange,
      //this.paginator.page
    ];

    this.exampleDatabase.getSubAdminList(this.exampleDatabase.page);


    return merge(...displayDataChanges).pipe(map( (res) => {
        // Filter data

        this.totalSubAdmin = this.exampleDatabase.total //result.total;

        this.filteredData =  this.exampleDatabase.data.slice().filter((issue: SubAdmin) => {
          const searchStr = (issue.user_id + issue.name + issue.email_id).toLowerCase();
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
    
    this.exampleDatabase.getSubAdminList(pageNumber);
  }

  /* Delete Item From List */
  deleteItem(index){
    this.exampleDatabase.deleteSubAdmin(index)
  }

  //Apply Filter
  applyFilter(){
    this.exampleDatabase.getSubAdminList(this.exampleDatabase.page);
  }

  //Clear Filter
  clearFilter(){
    this.exampleDatabase.getSubAdminList(this.exampleDatabase.page);
  }

  disconnect() {}

  /** Returns a sorted copy of the database data. */
  sortData(data: SubAdmin[]): SubAdmin[] {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string | Date = '';
      let propertyB: number | string | Date = '';
    

      switch (this.sort.active) {
        case 'user_id': [propertyA, propertyB] = [a.user_id, b.user_id]; break;
        case 'name': [propertyA, propertyB] = [a.name, b.name]; break;
        case 'email_id': [propertyA, propertyB] = [a.email_id, b.email_id]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this.sort.direction === 'asc' ? 1 : -1);
    });
  }
}
