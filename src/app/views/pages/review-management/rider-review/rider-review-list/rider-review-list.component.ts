import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

//Http API Method
import { HttpService } from '../../../../../services/http.service';

//API
import { ApiService } from '../../../../../services/api.service';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { SubheaderService } from '../../../../../core/_base/layout';

// Models
import { UserDeleted, User } from '../../../../../core/auth';
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../../../core/_base/crud';
// Services and Models
import {	ManyProductsDeleted } from '../../../../../core/e-commerce';

// Service
import { RiderReviewDataService } from '../../../../../services/review/rider-review-data.service';
import { CommonService } from '../../../../../services/common.service';

import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';
import { DataSource } from '@angular/cdk/collections';
import { RiderReview } from '../../../../../module/review/rider-review.module';
import { BehaviorSubject, fromEvent, Observable, merge } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

//Componenent
import { ViewRiderReviewDetailComponent } from '../view-rider-review-detail/view-rider-review-detail.component'

//Filter Component
import { ReviewFilterComponent } from '../../review-filter/review-filter.component';

//View User Details
import { ReviewUserDetailsComponent } from '../../review-user-details/review-user-details.component'

@Component({
  selector: 'kt-rider-review-list',
  templateUrl: './rider-review-list.component.html',
  styleUrls: ['./rider-review-list.component.scss']
})
export class RiderReviewListComponent implements OnInit {

    displayedColumns = ['id', 'rider_name', 'rider_mobile', 'reviews', 'avg_ratting', 'action'];

    exampleDatabase : RiderReviewDataService | null;
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
      public riderReviewDataService : RiderReviewDataService,
      private commonService : CommonService) { }

    ngOnInit() {
        // Set title to page breadCrumbs
        this.subheaderService.setTitle('Review Management');

        localStorage.setItem('reviewsFilter','');
        this.getRiderReviewList();
    }

    //Get Rider Review Data
    getRiderReviewList(){
      this.exampleDatabase = new RiderReviewDataService(this.httpClient,this.spinner,this.http,this.api);
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
      this.riderReviewDataService.page = event;
      this.dataSource.changePage(event);
    }

    //View Rider Review Details
    viewReview(rider_id){
      this.riderReviewDataService.mode = 3;

      const data = {
        'rider_id' : rider_id
      }

      this.http.postReqForVerify(this.api.viewRiderReviews,data).subscribe(res => {
          const result : any = res;
          if(result.status == true){

            const dialogRef = this.dialog.open(ViewRiderReviewDetailComponent, {
              width: '700px',
              height: 'auto',
              backdropClass: 'backdropBackground',
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

    //View User Details
    viewUserDetails(user_id){

      const data = {
        "user_id" : user_id
      }

      this.http.postReq(this.api.getUserDetail,data).subscribe(res => {
        const result : any = res;
        if(result.status == true){

          this.spinner.hide();

          const dialogRef = this.dialog.open(ReviewUserDetailsComponent, {
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

      this.commonService.type = 'riderReview';

      if(Object.keys(this.riderReviewDataService.formData).length > 0){
        this.riderReviewDataService.modeNum = 4;
      }

      const dialogRef = this.dialog.open(ReviewFilterComponent, {
        width: '800px',
        height: 'auto',
        backdropClass: 'masterModalPopup',
        data: { mode : 3, title : 'Riders Review More Filter' },
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
      
        if(result != 3){
          this.riderReviewDataService.modeNum = 0;
          this.riderReviewDataService.formData = {};
          this.dataSource.applyFilter();
        }
      });
    }
    
    //Clear Filter
    clearFilter(){
      localStorage.setItem('reviewsFilter','');
      this.riderReviewDataService.modeNum = 0;
      this.riderReviewDataService.formData = {};
      this.dataSource.clearFilter();
    }

}

//DataSource ===============================
export class ExampleDataSource extends DataSource<RiderReview>{
  _filterChange = new BehaviorSubject('');

  pageSize = 10

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: RiderReview[] = [];
  renderedData: RiderReview[] = [];
  public totalRides = 0;

  constructor(public exampleDatabase: RiderReviewDataService,
              public paginator: MatPaginator,
              public sort: MatSort) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<RiderReview[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this.sort.sortChange,
      this._filterChange,
      //this.paginator.page
    ];

    this.exampleDatabase.getRiderReviewList(this.exampleDatabase.page);


    return merge(...displayDataChanges).pipe(map( (res) => {
        // Filter data

        this.totalRides = this.exampleDatabase.total //result.total;

        this.filteredData =  this.exampleDatabase.data.slice().filter((issue: RiderReview) => {
          const searchStr = (issue.id + issue.rider_name + issue.rider_mobile + issue.avg_rating_count + issue.total_review_count).toLowerCase();
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
    this.exampleDatabase.getRiderReviewList(pageNumber);
  }

  //Apply Filter
  applyFilter(){
    this.exampleDatabase.getRiderReviewList(this.exampleDatabase.page);
  }

  //Clear Filter
  clearFilter(){
    this.exampleDatabase.getRiderReviewList(this.exampleDatabase.page);
  }

  /* Refresh perticular page */
  // refreshPage(pageNumber){
  //   this.exampleDatabase.getCurrentDriverList(pageNumber);
  // }

  disconnect() {}

  /** Returns a sorted copy of the database data. */
  sortData(data: RiderReview[]): RiderReview[] {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string | Date = '';
      let propertyB: number | string | Date = '';
    

      switch (this.sort.active) {
        case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
        case 'rider_name': [propertyA, propertyB] = [a.rider_name, b.rider_name]; break;
        case 'rider_mobile': [propertyA, propertyB] = [a.rider_mobile, b.rider_mobile]; break;
        case 'avg_rating_count': [propertyA, propertyB] = [a.avg_rating_count, b.avg_rating_count]; break;
        case 'total_review_count': [propertyA, propertyB] = [a.total_review_count, b.total_review_count]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this.sort.direction === 'asc' ? 1 : -1);
    });
  }
}
