import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';

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
import { ManyProductsDeleted } from '../../../../core/e-commerce';

//Filter Component
import { RidesFilterComponent } from '../rides-filter/rides-filter.component';

// Service
import { PendingRideDataService } from '../../../../services/ride/pending-ride-data.service';

import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
import { DataSource } from '@angular/cdk/collections';
import { PendingRideIssue } from '../../../../module/pending-ride-issue.module';
import { BehaviorSubject, fromEvent, Observable, merge } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'kt-pending-list',
  templateUrl: './pending-list.component.html',
  styleUrls: ['./pending-list.component.scss']
})
export class PendingListComponent implements OnInit {

    displayedColumns = ['select', 'id', 'rider_name', 'driver_name', 'start_date', 'end_date', 'start_location', 'end_location', 'amount', 'distance', 'actions'];

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
    urlType : string;
    pageTitle : string;

    constructor(public http: HttpService,
      private api: ApiService,
      private spinner: NgxSpinnerService,
      private subheaderService: SubheaderService,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private store: Store<AppState>,
      private httpClient : HttpClient,
      public pendingRideDataService : PendingRideDataService,
      private route : ActivatedRoute) { 
        
        localStorage.setItem('urlType',this.route.snapshot.paramMap.get('id'));

      }

    ngOnInit() {
       // Set title to page breadCrumbs
       this.subheaderService.setTitle('Ride Management');

      if(localStorage.getItem('urlType')=='currentweek'){
        this.pageTitle = 'Current Week Pending Ride List';
      }
      else if(localStorage.getItem('urlType')=='lastweek'){
        this.pageTitle = 'Last Week Pending Ride List';
      }
      else{
        this.pageTitle = 'Pending Ride List';
      }

       this.getPendingRideList();
    }

    //Get Pending Ride List
    getPendingRideList(){
      this.exampleDatabase = new PendingRideDataService(this.httpClient,this.spinner,this.http,this.api);
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
      this.pendingRideDataService.page = event;
      this.dataSource.changePage(event);
    }

    /**
     * Check all rows are selected
     */
    isAllSelected() {
      const numSelected = this.dataSource.selection.selected.length;
      const numRows = this.dataSource.pendingRideResult.length;
      return numSelected === numRows;
    }

    /**
     * Selects all rows if they are not all selected; otherwise clear selection
     */
    masterToggle() {
      if (this.isAllSelected()) {
        this.dataSource.selection.clear();
      } else {
        this.dataSource.pendingRideResult.forEach(row => this.dataSource.selection.select(row));
      }
    }

    /**
     * Delete Selected Rides
     */
    deleteRides() {
      const _title = 'Pending Ride Delete';
      const _description = 'Are you sure to permanently delete selected ride?';
      const _waitDesciption = 'Rides are deleting...';
      const _deleteMessage = 'Selected rides have been deleted';
      
      const idsForDeletion: number[] = [];
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.dataSource.selection.selected.length; i++) {
        idsForDeletion.push(this.dataSource.selection.selected[i].id);
      }    

      const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption, idsForDeletion, 'deleteRides');
      dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          return;
        }

        this.dataSource.deleteSelectedItem(idsForDeletion)
            
        this.store.dispatch(new ManyProductsDeleted({ ids: idsForDeletion }));
        this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
        this.dataSource.selection.clear();
      });
    }

    /**
     * Delete Perticular Ride
    */
    deleteRide(ride_id){
      const _title = 'Pending Ride Delete';
      const _description = 'Are you sure to permanently delete this ride?';
      const _waitDesciption = 'Ride is deleting...';
      const _deleteMessage = 'Ride has been deleted';

      const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption, ride_id, 'deleteRide');
      dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          return;
        }

        this.dataSource.deleteItem(ride_id)
            
        this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
        this.dataSource.selection.clear();
      });
    } 

    //Apply More Filter
    applyCustomFilter() {

      const dialogRef = this.dialog.open(RidesFilterComponent, {
        width: '800px',
        height: 'auto',
        backdropClass: 'masterModalPopup',
        data: { mode : 3, title : 'Pending Ride More Filter' },
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
      
        if(result != 3){
          this.dataSource.applyFilter();
        }
      });
    }  

}

//DataSource ===============================
export class ExampleDataSource extends DataSource<PendingRideIssue>{
  _filterChange = new BehaviorSubject('');

  selection = new SelectionModel<PendingRideIssue>(true, []);

  pageSize = 10

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: PendingRideIssue[] = [];
  renderedData: PendingRideIssue[] = [];
  pendingRideResult: PendingRideIssue[] = [];
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
        this.pendingRideResult = this.exampleDatabase.data;

        this.filteredData =  this.exampleDatabase.data.slice().filter((issue: PendingRideIssue) => {
          const searchStr = (issue.id + issue.driver_name + issue.rider_name + issue.start_datetime + issue.end_datetime + issue.start_location + issue.end_location + issue.distance).toLowerCase();
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
  
  //Delete Selected Item
  deleteSelectedItem(ids){
    this.exampleDatabase.deleteSelectedRides(ids)
  }

  //Apply Filter
  applyFilter(){
    this.exampleDatabase.getPendingRideListWithFilter(this.exampleDatabase.page);
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
        case 'driver_name': [propertyA, propertyB] = [a.driver_name, b.driver_name]; break;
        case 'rider_name': [propertyA, propertyB] = [a.rider_name, b.rider_name]; break;
        case 'start_datetime': [propertyA, propertyB] = [a.start_datetime, b.start_datetime]; break;
        case 'end_datetime': [propertyA, propertyB] = [a.end_datetime, b.end_datetime]; break;
        case 'start_location': [propertyA, propertyB] = [a.start_location, b.start_location]; break;
        case 'end_location': [propertyA, propertyB] = [a.end_location, b.end_location]; break;
        case 'amount': [propertyA, propertyB] = [a.amount, b.amount]; break;
        case 'distance': [propertyA, propertyB] = [a.distance, b.distance]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this.sort.direction === 'asc' ? 1 : -1);
    });
  }
}
