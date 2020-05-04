import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table'; 

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

// Service
import { PendingRideDataService } from '../../../../services/ride/pending-ride-data.service';

import { Store } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
import { DataSource } from '@angular/cdk/collections';
import { PendingRideIssue } from '../../../../module/pending-ride-issue.module';
import { BehaviorSubject, fromEvent, Observable, merge } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';


@Component({
  selector: 'kt-pending-list',
  templateUrl: './pending-list.component.html',
  styleUrls: ['./pending-list.component.scss']
})
export class PendingListComponent implements OnInit {

    displayedColumns = ['id', 'rider_name', 'driver_name', 'start_date', 'end_date', 'start_location', 'end_location', 'amount', 'distance', 'actions'];

    exampleDatabase : PendingRideDataService | null;
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
      public pendingRideDataService : PendingRideDataService) { }

    ngOnInit() {
       // Set title to page breadCrumbs
       this.subheaderService.setTitle('Ride Management');

       this.getPendingRideList();
    }

    getPendingRideList(){
      this.exampleDatabase = new PendingRideDataService(this.httpClient,this.spinner,this.http,this.api);
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
      this.pendingRideDataService.page = event;
      this.dataSource.changePage(event);
    }

}

//DataSource ===============================
export class ExampleDataSource extends DataSource<PendingRideIssue>{
  _filterChange = new BehaviorSubject('');

  pageSize = 10

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: PendingRideIssue[] = [];
  renderedData: PendingRideIssue[] = [];
  public totalDriver = 0;

  constructor(public exampleDatabase: PendingRideDataService,
              public paginator: MatPaginator,
              public sort: MatSort) {
    super();
    // Reset to the first page when the user changes the filter.
    //this._filterChange.subscribe(() => this._paginator.page = 0);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<PendingRideIssue[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this.sort.sortChange,
      this._filterChange,
      //this.paginator.page
    ];

    this.exampleDatabase.getPendingRideList(this.exampleDatabase.page);

    return merge(...displayDataChanges).pipe(map( (res) => {
        // Filter data

        this.totalDriver = this.exampleDatabase.total //result.total;

  
        this.filteredData =  this.exampleDatabase.data.slice().filter((issue: PendingRideIssue) => {
          const searchStr = (issue.id + issue.first_name + issue.last_name + issue.mobile_no + issue.date_of_birth + issue.date_of_register).toLowerCase();
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
    
    this.exampleDatabase.getPendingRideList(pageNumber);
  }

  /* Delete Item From List */
  deleteItem(index){
    this.exampleDatabase.deletePendingRide(index)
  }

  /* Refresh perticular page */
  // refreshPage(pageNumber){
  //   this.exampleDatabase.getCurrentDriverList(pageNumber);
  // }

  disconnect() {}

  /** Returns a sorted copy of the database data. */
  sortData(data: PendingRideIssue[]): PendingRideIssue[] {
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
