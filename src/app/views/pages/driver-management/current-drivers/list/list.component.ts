import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table'; 

//Http API Method
import { HttpService } from '../../../../../services/http.service';

//API
import { ApiService } from '../../../../../services/api.service';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { SubheaderService } from '../../../../../core/_base/layout';

//Component
import { ViewComponent } from '../view/view.component';

//Service
import { EditDriverService } from '../../../../../services/driver/edit-driver.service'
import { CurDriverDataService } from '../../../../../services/driver/cur-driver-data.service';
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../../../core/_base/crud';

import { Store } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';
import { DataSource } from '@angular/cdk/collections';
import { CurrentDriverIssue } from '../../../../../module/current-driver-issue.module';
import { BehaviorSubject, fromEvent, Observable, merge } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'kt-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

    displayedColumns = ['id', 'username', 'mobile_no', 'rides', 'cancelled_ride', 'acceptance_ratio', 'rejected_ratio', 'last_week_online_hours', 'current_week_online_hours', 'total_online_hours', 'total_reviews', 'average_rating', 'date_of_birth', 'date_of_register', 'device_type', 'verify', 'actions'];

    exampleDatabase : CurDriverDataService | null;
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
      private editDriverService : EditDriverService,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private store: Store<AppState>,
      private httpClient : HttpClient,
      public curDriverDataService : CurDriverDataService) { }

    ngOnInit() {

        // Set title to page breadCrumbs
    	  this.subheaderService.setTitle('Driver Management');

        this.driverList();
    }

    driverList(){

      this.exampleDatabase = new CurDriverDataService(this.httpClient,this.spinner,this.http,this.api);
      this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);
      fromEvent(this.filter.nativeElement, 'keyup')
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      })
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
      this.curDriverDataService.page = event;
      this.dataSource.changePage(event);
    }

    // Vew Driver Details
    viewDriverDetails(driverData){
      this.editDriverService.obj = driverData;
      this.editDriverService.mode = 3;

      const dialogRef = this.dialog.open(ViewComponent, {
        width: '700px',
        height: 'auto',
        backdropClass: 'masterModalPopup',
        data: { mode: 3, driverData : driverData }
      });
      dialogRef.afterClosed().subscribe(result => {
        
       if (result === false) {
          this.spinner.hide();
        }
      });
    }

}

//DataSource ===============================
export class ExampleDataSource extends DataSource<CurrentDriverIssue>{
  _filterChange = new BehaviorSubject('');

  pageSize = 10

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: CurrentDriverIssue[] = [];
  renderedData: CurrentDriverIssue[] = [];
  public totalDriver = 0;

  constructor(public exampleDatabase: CurDriverDataService,
              public paginator: MatPaginator,
              public sort: MatSort) {
    super();
    // Reset to the first page when the user changes the filter.
    //this._filterChange.subscribe(() => this._paginator.page = 0);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<CurrentDriverIssue[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this.sort.sortChange,
      this._filterChange,
      //this.paginator.page
    ];

    this.exampleDatabase.getCurrentDriverList(this.exampleDatabase.page);

    return merge(...displayDataChanges).pipe(map( (res) => {
        // Filter data

        const result : any = res;

        this.totalDriver = this.exampleDatabase.total //result.total;

  
        this.filteredData =  this.exampleDatabase.data.slice().filter((issue: CurrentDriverIssue) => {
          const searchStr = (issue.id + issue.first_name + issue.last_name + issue.mobile_no + issue.date_of_birth + issue.date_of_register).toLowerCase();
          return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
        });

        // Sort filtered data
        this.renderedData = this.sortData(this.filteredData.slice());

        // Grab the page's slice of the filtered sorted data.
        // const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        // this.renderedData = this.filteredData.splice(startIndex, this.paginator.pageSize);

        // console.log("=================>>>",this.renderedData);

        return this.renderedData;
        

      }
    ));
  }

  /*Change Pagination and get next page data */
  changePage(pageNumber){
    
    this.exampleDatabase.getCurrentDriverList(pageNumber);
  }

  /*Change Pagination and get next page data */
  filterData(data){

    this.exampleDatabase.dataChange.subscribe(res => {

      this.renderedData = res;

      this.renderedData = data.trim().toLowerCase();

    })
  }

  /* Delete Item From List */
  deleteItem(index){
    this.exampleDatabase.deleteDriver(index)
  }

  /* Refresh perticular page */
  // refreshPage(pageNumber){
  //   this.exampleDatabase.getCurrentDriverList(pageNumber);
  // }

  disconnect() {}

  /** Returns a sorted copy of the database data. */
  sortData(data: CurrentDriverIssue[]): CurrentDriverIssue[] {
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
        case 'driver_rides_count': [propertyA, propertyB] = [a.driver_rides_count, b.driver_rides_count]; break;
        case 'driver_cancel_ride_count': [propertyA, propertyB] = [a.driver_cancel_ride_count, b.driver_cancel_ride_count]; break;
        case 'acceptance_ratio': [propertyA, propertyB] = [a.acceptance_ratio, b.acceptance_ratio]; break;
        case 'rejected_ratio': [propertyA, propertyB] = [a.rejected_ratio, b.rejected_ratio]; break;
        case 'online_hours_last_week': [propertyA, propertyB] = [a.online_hours_last_week, b.online_hours_last_week]; break;
        case 'online_hours_current_week': [propertyA, propertyB] = [a.online_hours_current_week, b.online_hours_current_week]; break;
        case 'total_online_hours': [propertyA, propertyB] = [a.total_online_hours, b.total_online_hours]; break;
        case 'driver_total_review_count': [propertyA, propertyB] = [a.driver_total_review_count, b.driver_total_review_count]; break;
        case 'driver_avg_rating_count': [propertyA, propertyB] = [a.driver_avg_rating_count, b.driver_avg_rating_count]; break;
        case 'date_of_birth': [propertyA, propertyB] = [a.date_of_birth, b.date_of_birth]; break;
        case 'date_of_register': [propertyA, propertyB] = [a.date_of_register, b.date_of_register]; break;
        case 'device_type': [propertyA, propertyB] = [a.device_type, b.device_type]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this.sort.direction === 'asc' ? 1 : -1);
    });
  }
}
