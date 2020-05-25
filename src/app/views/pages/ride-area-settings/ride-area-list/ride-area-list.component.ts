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
import { RideAreaDataService } from '../../../../services/ride-area/ride-area-data.service';

//Component
import { ViewRideAreaComponent } from '../view-ride-area/view-ride-area.component';

import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
import { DataSource } from '@angular/cdk/collections';
import { RideArea } from '../../../../module/ride-area/ride-area.module';
import { BehaviorSubject, fromEvent, Observable, merge } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'kt-ride-area-list',
  templateUrl: './ride-area-list.component.html',
  styleUrls: ['./ride-area-list.component.scss']
})
export class RideAreaListComponent implements OnInit {

    displayedColumns = ['id', 'area_name', 'created_date', 'actions'];

    exampleDatabase : RideAreaDataService | null;
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
      public rideAreaDataService : RideAreaDataService) { }

    ngOnInit() {
        // Set title to page breadCrumbs
        this.subheaderService.setTitle('Ride Area Settings');

        this.getRideAreaList();
    }

    //Get Pending Ride List
    getRideAreaList(){
      this.exampleDatabase = new RideAreaDataService(this.httpClient,this.spinner,this.http,this.api);
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
      this.rideAreaDataService.page = event;
      this.dataSource.changePage(event);
    }

    /**
     * Delete Perticular Ride Area
    */
    deleteArea(area_id){
      const _title = 'Delete Ride Area';
      const _description = 'Are you sure to permanently delete this ride area?';
      const _waitDesciption = 'Ride area is deleting...';
      const _deleteMessage = 'Ride area has been deleted';

      const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption, area_id, 'deleteRideArea');
      dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          return;
        }

        this.dataSource.deleteItem(area_id)
            
        this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
      });
    } 

    //View Driver Review Details
    viewAreaBoundaries(area_id){
      this.rideAreaDataService.mode = 3;

      const data = {
        'id' : area_id
      }

      this.http.postReqForVerify(this.api.viewAreaBoundaries,data).subscribe(res => {
          const result : any = res;
          if(result.status == true){

            const dialogRef = this.dialog.open(ViewRideAreaComponent, {
              width: '1000px',
              height: 'auto',
              backdropClass: 'masterModalPopup',
              data: { mode: 3, zoom : 8, area : JSON.parse(result.data.coordinates), latitude : parseFloat(result.data.lat), longitude : parseFloat(result.data.long) }
            });
            dialogRef.afterClosed().subscribe(result => {
              
              if (result === false) {
                this.spinner.hide();
              }
            });
            
          }
      })
    }

}

//DataSource ===============================
export class ExampleDataSource extends DataSource<RideArea>{
  _filterChange = new BehaviorSubject('');

  pageSize = 10

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: RideArea[] = [];
  renderedData: RideArea[] = [];
  public totalRides = 0;

  constructor(public exampleDatabase: RideAreaDataService,
              public paginator: MatPaginator,
              public sort: MatSort) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<RideArea[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this.sort.sortChange,
      this._filterChange,
      //this.paginator.page
    ];

    this.exampleDatabase.getRideAreaList(this.exampleDatabase.page);


    return merge(...displayDataChanges).pipe(map( (res) => {
        // Filter data

        this.totalRides = this.exampleDatabase.total //result.total;

        this.filteredData =  this.exampleDatabase.data.slice().filter((issue: RideArea) => {
          const searchStr = (issue.id + issue.area_name + issue.created_date).toLowerCase();
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
    
    this.exampleDatabase.getRideAreaList(pageNumber);
  }

  /* Delete Item From List */
  deleteItem(index){
    this.exampleDatabase.deleteArea(index)
  }

  disconnect() {}

  /** Returns a sorted copy of the database data. */
  sortData(data: RideArea[]): RideArea[] {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string | Date = '';
      let propertyB: number | string | Date = '';
    

      switch (this.sort.active) {
        case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
        case 'area_name': [propertyA, propertyB] = [a.area_name, b.area_name]; break;
        case 'created_date': [propertyA, propertyB] = [a.created_date, b.created_date]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this.sort.direction === 'asc' ? 1 : -1);
    });
  }
}
