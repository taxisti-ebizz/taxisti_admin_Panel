import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table'; 

//Http API Method
import { HttpService } from '../../../../services/http.service';

//API
import { ApiService } from '../../../../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgxSpinnerService } from 'ngx-spinner';
import { SubheaderService } from '../../../../core/_base/layout';

// Services
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../../core/_base/crud';

//Edit User Modal
import { UserEditComponent } from '../user-edit/user-edit.component';

//View User detailsl 
import { ViewUserDetailsComponent } from '../view-user-details/view-user-details.component';

// Models
import { UserDeleted, User } from '../../../../core/auth';

// Edit User Service
import { EditUserService } from '../../../../services/user/edit-user.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';

//=================================New===============================================
import {DataSource} from '@angular/cdk/collections';
import { fromEvent, BehaviorSubject, Observable, merge } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {UserIssue} from '../../../../core/e-commerce/_models/user-issue.module';
import {map} from 'rxjs/operators';
import { DataService } from '../../../../services/user/data.service';

//===========================================End New============================================


@Component({
  selector: 'kt-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

    displayedColumns = ['id', 'username', 'mobile_no', 'completed_ride', 'cancelled_ride', 'total_reviews', 'average_rating', 'date_of_birth', 'date_of_register', 'device_type', 'verify', 'actions'];
	
    //dataSource: MatTableDataSource<any>;
    
    page = 0;
    pageSize = 10

    //======================================New==============================================
      exampleDatabase: DataService | null;
      dataSource: ExampleDataSource | null;
      index: number;
      id: number;

      @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator; //Old
      @ViewChild(MatSort, { static: true }) sort: MatSort; // Old
      @ViewChild('filter', {static: true}) filter: ElementRef;
    //=========================================End New=========================================

  
    constructor(private http: HttpService,
      private api: ApiService,
      private spinner: NgxSpinnerService,
      private subheaderService: SubheaderService,
      public editUserService : EditUserService,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private store: Store<AppState>,
      private httpClient : HttpClient,
      public dataService : DataService) { }

    ngOnInit() {
      // Set title to page breadCrumbs
      this.subheaderService.setTitle('User Management');

      this.loadData();
    }

    //Load User Data
    loadData(){
    
      //=============================New===============================================
        this.exampleDatabase = new DataService(this.httpClient,this.spinner);
        this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);
        
        fromEvent(this.filter.nativeElement, 'keyup')
        // .debounceTime(150)
        // .distinctUntilChanged()
        .subscribe(() => {
          if (!this.dataSource) {
            return;
          }
          this.dataSource.filter = this.filter.nativeElement.value;
        });
        

      //=============================End  New===============================================
    }

    //Handle Page
    handlePage(event){
      this.dataService.page = event;
      this.dataSource.changePage(event)
    }
    
    startEdit(i: number, userData) {
      
      this.id = userData.id;
      // index row is used just for debugging proposes and can be removed
      this.index = i;
      const dialogRef = this.dialog.open(UserEditComponent, {
        data: { user : userData }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 1) {
          // When using an edit things are little different, firstly we find record inside DataService by id
          const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
          // Then you update that record using data from dialogData (values you enetered)
          this.exampleDatabase.dataChange.value[foundIndex] = this.dataService.getDialogData();
          // And lastly refresh table
          this.refreshTable();
        }
      });
    }

    private refreshTable() {
      // Refreshing table using paginator
      // Thanks yeager-j for tips
      // https://github.com/marinantonio/angular-mat-table-crud/issues/12
      this.paginator._changePageSize(this.paginator.pageSize);
    }

    //View User Details
    viewUser(userData){
      this.editUserService.obj = userData;
      this.editUserService.mode = 3;

      const dialogRef = this.dialog.open(ViewUserDetailsComponent, {
        width: '700px',
        height: 'auto',
        backdropClass: 'masterModalPopup',
        data: { mode: 3, userData : userData }
      });
      dialogRef.afterClosed().subscribe(result => {
        
        if (result === false) {
          this.spinner.hide();
        }
      });
    }

    //Verify User 
    verifyUser(userId,status){
      var _title = '';
      var _description = '';
      var _waitDesciption = '';
      var _deleteMessage = '';
      if(status == 0){
        _title = 'User Unapprove';
        _description = 'Are you sure want to Unapprove?';
        _waitDesciption = 'User is unapproving...';
        _deleteMessage = `User has been Unapproved`;
      }else{
        _title = 'User Approve';
        _description = 'Are you sure want to Approve?';
        _waitDesciption = 'User is aprroving...';
        _deleteMessage = `User has been Approve`;
      }

      const dialogRef = this.layoutUtilsService.verifyElement(_title, _description, _waitDesciption, userId, status, 'user');
      dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          return;
        }

        this.store.dispatch(new UserDeleted({ id: userId }));
        this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
      });
    }

    //Delete USer
    deleteUser(_item: User) {
      const _title = 'User Delete';
      const _description = 'Are you sure to permanently delete this user?';
      const _waitDesciption = 'User is deleting...';
      const _deleteMessage = `User has been deleted`;

      const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption, _item, 'user');
      dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          return;
        }

        this.store.dispatch(new UserDeleted({ id: _item.id }));
        this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
      });
    }

    //User list search filter
    applyFilter(filterValue: string) {

      //this.dataSource.filterData(filterValue);

      this.dataSource.filter = filterValue.trim().toLowerCase();

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
}

//===================================New ===================================================
export class ExampleDataSource extends DataSource<UserIssue> {
  _filterChange = new BehaviorSubject('');

  pageSize = 10

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: UserIssue[] = [];
  renderedData: UserIssue[] = [];
  totalUser = 0;

  constructor(public exampleDatabase: DataService,
              public paginator: MatPaginator,
              public sort: MatSort) {
    super();
    // Reset to the first page when the user changes the filter.
    //this._filterChange.subscribe(() => this._paginator.page = 0);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<UserIssue[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this.sort.sortChange,
      this._filterChange,
      //this.paginator.page
    ];

    this.exampleDatabase.getAllIssues(this.exampleDatabase.page);

    return merge(...displayDataChanges).pipe(map( (res) => {
        // Filter data

        const result : any = res;

        this.totalUser = result.total;
        var data = result.data;


        //this.exampleDatabase.dataChange = data;
      

        if(Array.isArray(data) == true){
           this.filteredData =  data.slice().filter((issue: UserIssue) => {
            const searchStr = (issue.id + issue.first_name + issue.last_name + issue.mobile_no + issue.date_of_birth + issue.date_of_register).toLowerCase();
            return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
          });

          // Sort filtered data
         // const sortedData = this.sortData(this.filteredData.slice());

          // Grab the page's slice of the filtered sorted data.
          // const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
          // this.renderedData = this.filteredData.splice(startIndex, this.paginator.pageSize);

          // console.log("=================>>>",this.renderedData);

          return this.filteredData;
        }

      }
    ));
  }

  changePage(pageNumber){
    this.exampleDatabase.getAllIssues(pageNumber);

    this.exampleDatabase.dataChange.subscribe(data => {
      this.filteredData = data
    })
  }

  filterData(data){

   
    this.exampleDatabase.dataChange.subscribe(res => {

      this.renderedData = res;

      this.renderedData = data.trim().toLowerCase();

      console.log("filteredData ======>>>>>>",this.renderedData);
      

    })
  }

  disconnect() {}


  /** Returns a sorted copy of the database data. */
  sortData(data: UserIssue[]): UserIssue[] {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string | Date = '';
      let propertyB: number | string | Date = '';
    

      switch (this.sort.active) {
        case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
        case 'first_name': [propertyA, propertyB] = [a.first_name, b.first_name]; break;
        case 'last_name': [propertyA, propertyB] = [a.last_name, b.last_name]; break;
        case 'mobile_no': [propertyA, propertyB] = [a.mobile_no, b.mobile_no]; break;
        case 'completed_ride': [propertyA, propertyB] = [a.completed_ride, b.completed_ride]; break;
        case 'cancelled_ride': [propertyA, propertyB] = [a.cancelled_ride, b.cancelled_ride]; break;
        case 'total_reviews': [propertyA, propertyB] = [a.total_reviews, b.total_reviews]; break;
        case 'average_rating': [propertyA, propertyB] = [a.average_rating, b.average_rating]; break;
        case 'date_of_birth': [propertyA, propertyB] = [a.date_of_birth, b.date_of_birth]; break;
        case 'date_of_register': [propertyA, propertyB] = [a.date_of_register, b.date_of_register]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this.sort.direction === 'asc' ? 1 : -1);
    });
  }
}
