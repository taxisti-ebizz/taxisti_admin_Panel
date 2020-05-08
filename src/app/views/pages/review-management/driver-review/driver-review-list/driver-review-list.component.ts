import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

//Http API Method
import { HttpService } from '../../../../../services/http.service';

//API
import { ApiService } from '../../../../../services/api.service';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { SubheaderService } from '../../../../../core/_base/layout';

// Service
import { DriverReviewDataService } from '../../../../../services/review/driver-review-data.service';

import { DataSource } from '@angular/cdk/collections';
import { DriverReview } from '../../../../../module/review/driver-review.module';
import { BehaviorSubject, fromEvent, Observable, merge } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

//Componenent
import { ViewDriverReviewDetailComponent } from '../view-driver-review-detail/view-driver-review-detail.component'

@Component({
  selector: 'kt-driver-review-list',
  templateUrl: './driver-review-list.component.html',
  styleUrls: ['./driver-review-list.component.scss']
})
export class DriverReviewListComponent implements OnInit {

    displayedColumns = ['id', 'driver_name', 'driver_mobile', 'reviews', 'avg_ratting', 'action'];

    exampleDatabase : DriverReviewDataService | null;
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
      private httpClient : HttpClient,
      public driverReviewDataService : DriverReviewDataService) { }

    ngOnInit() {
       // Set title to page breadCrumbs
       this.subheaderService.setTitle('Review Management');

       this.getDiverReviewList();
    }

    //Get Driver Review Data
    getDiverReviewList(){
      this.exampleDatabase = new DriverReviewDataService(this.httpClient,this.spinner,this.http,this.api);
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
      this.driverReviewDataService.page = event;
      this.dataSource.changePage(event);
    }

   //View Driver Review Details
    viewReview(driver_id){
      this.driverReviewDataService.mode = 3;

      const data = {
        'driver_id' : driver_id
      }

      this.http.postReqForVerify(this.api.viewDriverReviews,data).subscribe(res => {
          const result : any = res;
          if(result.status == true){

            const dialogRef = this.dialog.open(ViewDriverReviewDetailComponent, {
              width: '700px',
              height: 'auto',
              backdropClass: 'masterModalPopup',
              data: { mode: 3, reviewData : result.data }
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
export class ExampleDataSource extends DataSource<DriverReview>{
  _filterChange = new BehaviorSubject('');

  pageSize = 10

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: DriverReview[] = [];
  renderedData: DriverReview[] = [];
  public totalRides = 0;

  constructor(public exampleDatabase: DriverReviewDataService,
              public paginator: MatPaginator,
              public sort: MatSort) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<DriverReview[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this.sort.sortChange,
      this._filterChange,
      //this.paginator.page
    ];

    this.exampleDatabase.getDriverReviewList(this.exampleDatabase.page);


    return merge(...displayDataChanges).pipe(map( (res) => {
        // Filter data

        this.totalRides = this.exampleDatabase.total //result.total;

        this.filteredData =  this.exampleDatabase.data.slice().filter((issue: DriverReview) => {
          const searchStr = (issue.id + issue.driver_name + issue.driver_mobile + issue.driver_avg_rating_count + issue.driver_total_review_count).toLowerCase();
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
    
    this.exampleDatabase.getDriverReviewList(pageNumber);
  }

  /* Refresh perticular page */
  // refreshPage(pageNumber){
  //   this.exampleDatabase.getCurrentDriverList(pageNumber);
  // }

  disconnect() {}

  /** Returns a sorted copy of the database data. */
  sortData(data: DriverReview[]): DriverReview[] {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string | Date = '';
      let propertyB: number | string | Date = '';
    

      switch (this.sort.active) {
        case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
        case 'driver_name': [propertyA, propertyB] = [a.driver_name, b.driver_name]; break;
        case 'driver_mobile': [propertyA, propertyB] = [a.driver_mobile, b.driver_mobile]; break;
        case 'driver_avg_rating_count': [propertyA, propertyB] = [a.driver_avg_rating_count, b.driver_avg_rating_count]; break;
        case 'driver_total_review_count': [propertyA, propertyB] = [a.driver_total_review_count, b.driver_total_review_count]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this.sort.direction === 'asc' ? 1 : -1);
    });
  }
}
