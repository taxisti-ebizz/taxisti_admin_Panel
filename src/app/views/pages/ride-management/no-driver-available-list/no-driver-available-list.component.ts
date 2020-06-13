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
import {	ManyProductsDeleted } from '../../../../core/e-commerce';

// Service
import { NoDriverAvailableDataService } from '../../../../services/ride/no-driver-available-data.service';

//Filter Component
import { NoDriverAvailableFilterComponent } from '../no-driver-available-list/no-driver-available-filter/no-driver-available-filter.component';

//View Ride User details
import { ViewRideUserDetailsComponent } from '../view-ride-user-details/view-ride-user-details.component';

import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
import { DataSource } from '@angular/cdk/collections';
import { NoDriverAvailableRide } from '../../../../module/no-driver-available-ride.module';
import { BehaviorSubject, fromEvent, Observable, merge } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'kt-no-driver-available-list',
  templateUrl: './no-driver-available-list.component.html',
  styleUrls: ['./no-driver-available-list.component.scss']
})
export class NoDriverAvailableListComponent implements OnInit {

    displayedColumns = ['select', 'id', 'rider_name', 'rider_mobile', 'start_location', 'created_date', 'action'];

    exampleDatabase : NoDriverAvailableDataService | null;
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
      public noDriverAvailableDataService : NoDriverAvailableDataService,
      private route : ActivatedRoute) { 
        
        localStorage.setItem('urlType',this.route.snapshot.paramMap.get('id'));

      }

    ngOnInit() {
        // Set title to page breadCrumbs
        this.subheaderService.setTitle('Ride Management');

        if(localStorage.getItem('urlType')=='currentweek'){
          this.pageTitle = 'Current Week Driver Not Available List';
        }
        else if(localStorage.getItem('urlType')=='lastweek'){
          this.pageTitle = 'Last Week Driver Not Available List';
        }
        else{
          this.pageTitle = 'Driver Not Available List';
        }

        localStorage.setItem('notAvailRidesFilter','');
        this.getNoDriverAvailableList();
    }

    //Get No Driver Available List
    getNoDriverAvailableList(){
      this.exampleDatabase = new NoDriverAvailableDataService(this.httpClient,this.spinner,this.http,this.api);
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
      this.noDriverAvailableDataService.page = event;
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
      const _title = 'Delete Driver Not Available';
      const _description = 'Are you sure to permanently delete selected driver?';
      const _waitDesciption = 'Drivers are deleting...';
      const _deleteMessage = 'Selected drivers have been deleted';
      
      const idsForDeletion: number[] = [];
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.dataSource.selection.selected.length; i++) {
        idsForDeletion.push(this.dataSource.selection.selected[i].id);
      }    

      const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption, idsForDeletion, 'dltDriverNotAvail');
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
      const _title = 'Delete Driver Not Available';
      const _description = 'Are you sure to permanently delete this driver?';
      const _waitDesciption = 'Driver is deleting...';
      const _deleteMessage = 'Driver has been deleted';

      const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption, ride_id, 'dltDriverNotAvail');
      dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          return;
        }

        this.dataSource.deleteItem(ride_id)
            
        this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
        this.dataSource.selection.clear();
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

          const dialogRef = this.dialog.open(ViewRideUserDetailsComponent, {
            width: '700px',
            height: 'auto',
            backdropClass: 'masterModalPopup',
            data: { mode: 3, userData : result.data },
            disableClose: true
          });
          dialogRef.afterClosed().subscribe(result => {
            
            if (result === false) {
              this.spinner.hide();
            }
          });
        }
      })
      
    }

    //Apply More Filter
    applyCustomFilter() {

      if(Object.keys(this.noDriverAvailableDataService.formData).length > 0){
        this.noDriverAvailableDataService.mode = 4;
      }

      const dialogRef = this.dialog.open(NoDriverAvailableFilterComponent, {
        width: '800px',
        height: 'auto',
        backdropClass: 'masterModalPopup',
        data: { mode : 3, title : 'Driver Not Available More Filter', type : '' },
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
      
        if(result != 3){
          this.noDriverAvailableDataService.mode = 0;
          this.noDriverAvailableDataService.formData = {};
          this.dataSource.applyFilter();
        }
      });
    }  

    //Clear Filter
    clearFilter(){
      localStorage.setItem('notAvailRidesFilter','');
      this.noDriverAvailableDataService.mode = 0;
      this.noDriverAvailableDataService.formData = {};
      this.dataSource.clearFilter();
    }
}

//DataSource ===============================
export class ExampleDataSource extends DataSource<NoDriverAvailableRide>{
  _filterChange = new BehaviorSubject('');

  selection = new SelectionModel<NoDriverAvailableRide>(true, []);

  pageSize = 10

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: NoDriverAvailableRide[] = [];
  renderedData: NoDriverAvailableRide[] = [];
  pendingRideResult: NoDriverAvailableRide[] = [];
  public totalRides = 0;

  constructor(public exampleDatabase: NoDriverAvailableDataService,
              public paginator: MatPaginator,
              public sort: MatSort) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<NoDriverAvailableRide[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this.sort.sortChange,
      this._filterChange,
      //this.paginator.page
    ];

    this.exampleDatabase.getNoDriverAvailableList(this.exampleDatabase.page);


    return merge(...displayDataChanges).pipe(map( (res) => {
        // Filter data

        this.totalRides = this.exampleDatabase.total //result.total;
        this.pendingRideResult = this.exampleDatabase.data;

        this.filteredData =  this.exampleDatabase.data.slice().filter((issue: NoDriverAvailableRide) => {
          const searchStr = (issue.id + issue.rider_name + issue.created_date + issue.start_location + issue.rider_mobile).toLowerCase();
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
    this.exampleDatabase.getNoDriverAvailableList(pageNumber);
  }

  /* Delete Item From List */
  deleteItem(index){
    this.exampleDatabase.deleteDriver(index)
  }

  //Delete Selected Ride
  deleteSelectedItem(ids){
    this.exampleDatabase.deleteSelectedRides(ids)
  }

  //Apply Filter
  applyFilter(){
    this.exampleDatabase.getNoDriverAvailableList(this.exampleDatabase.page);
  }

  //Clear Filter
  clearFilter(){
    this.exampleDatabase.getNoDriverAvailableList(this.exampleDatabase.page);
  }

  /* Refresh perticular page */
  // refreshPage(pageNumber){
  //   this.exampleDatabase.getCurrentDriverList(pageNumber);
  // }

  disconnect() {}

  /** Returns a sorted copy of the database data. */
  sortData(data: NoDriverAvailableRide[]): NoDriverAvailableRide[] {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string | Date = '';
      let propertyB: number | string | Date = '';
    

      switch (this.sort.active) {
        case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
        case 'rider_mobile': [propertyA, propertyB] = [a.rider_mobile, b.rider_mobile]; break;
        case 'rider_name': [propertyA, propertyB] = [a.rider_name, b.rider_name]; break;
        case 'created_date': [propertyA, propertyB] = [a.created_date, b.created_date]; break;
        case 'start_location': [propertyA, propertyB] = [a.start_location, b.start_location]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this.sort.direction === 'asc' ? 1 : -1);
    });
  }
}

