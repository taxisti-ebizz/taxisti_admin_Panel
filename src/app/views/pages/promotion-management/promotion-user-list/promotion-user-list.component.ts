import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

//Http API Method
import { HttpService } from '../../../../services/http.service';

//API
import { ApiService } from '../../../../services/api.service';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { SubheaderService } from '../../../../core/_base/layout';

// Models
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../../core/_base/crud';

// Service
import { PromotionUserDataService } from '../../../../services/promotion/promotion-user-data.service';

//Filter Component
import { PromotionUserFilterComponent } from '../promotion-user-list/promotion-user-filter/promotion-user-filter.component';

import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
import { DataSource } from '@angular/cdk/collections';
import { PromotionUser } from '../../../../module/promotion/promotion-user.module';
import { BehaviorSubject, fromEvent, Observable, merge } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

//View User Detail
import { ViewPromotionUserDetailsComponent } from './../view-promotion-user-details/view-promotion-user-details.component';

//Toastr Messages
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'kt-promotion-user-list',
  templateUrl: './promotion-user-list.component.html',
  styleUrls: ['./promotion-user-list.component.scss']
})
export class PromotionUserListComponent implements OnInit {

    //'profile_pic',
    displayedColumns = ['id', 'username', 'mobile', 'description', 'created_date', 'action'];

    exampleDatabase : PromotionUserDataService | null;
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
    promotion : any;

    constructor(private http: HttpService,
      private api: ApiService,
      private spinner: NgxSpinnerService,
      private subheaderService: SubheaderService,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private store: Store<AppState>,
      private httpClient : HttpClient,
      public promotionUserDataService : PromotionUserDataService,
      private toastr : ToastrService) { }

    ngOnInit() {
        // Set title to page breadCrumbs
        this.subheaderService.setTitle('Promotion Management');

        localStorage.setItem('promotionUserFilter','');
        this.getPromotionUserList();
    }

    getPromotionUserList(){
      this.exampleDatabase = new PromotionUserDataService(this.httpClient,this.spinner,this.http,this.api);
      this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);
      // fromEvent(this.filter.nativeElement, 'keyup')
      // .subscribe(() => {
      //   if (!this.dataSource) {
      //     return;
      //   }
      //   this.dataSource.filter = this.filter.nativeElement.value;
      // })
    }

    //Promotion list search filter
    applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }

    //Handle Page
    handlePage(event){
      this.promotionUserDataService.page = event;
      this.dataSource.changePage(event);
    }

    //Redeem Coupon 
    redeemCoupon(coupon_id){
      const _title = 'Redeem Coupon';
      const _description = 'Are you sure to redeem this coupon?';
      const _waitDesciption = 'Coupon is redeeming...';
      const _deleteMessage = 'Coupon has been redeemed';
  
      const dialogRef = this.layoutUtilsService.verifyElement(_title, _description, _waitDesciption, coupon_id, 1, 'redeemCoupon');
      dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          return;
        }

        this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
        
        const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === coupon_id);
        this.exampleDatabase.dataChange.subscribe(res => {
          const result : any = res;
            result[foundIndex].redeem = 1;
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

          const dialogRef = this.dialog.open(ViewPromotionUserDetailsComponent, {
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
        }else{
          this.spinner.hide();
          this.toastr.error('Something went wrong');
        }
      })
      
    }
    
    //Apply Custom Filter
    applyCustomFilter(){

      const dialogRef = this.dialog.open(PromotionUserFilterComponent, {
        width: '800px',
        height: 'auto',
        backdropClass: 'masterModalPopup',
        data: { mode : 3, title : 'Promotion User More Filter' },
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
      localStorage.setItem('promotionUserFilter','');
      this.dataSource.clearFilter();
    }

}

//DataSource ===============================
export class ExampleDataSource extends DataSource<PromotionUser>{
  _filterChange = new BehaviorSubject('');

  pageSize = 10

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: PromotionUser[] = [];
  renderedData: PromotionUser[] = [];
  public totalPromotionUser = 0;

  constructor(public exampleDatabase: PromotionUserDataService,
              public paginator: MatPaginator,
              public sort: MatSort) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<PromotionUser[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this.sort.sortChange,
      this._filterChange,
      //this.paginator.page
    ];

    this.exampleDatabase.getPromotionUserList(this.exampleDatabase.page);

    return merge(...displayDataChanges).pipe(map( (res) => {
        // Filter data

        this.totalPromotionUser = this.exampleDatabase.total //result.total;

        this.filteredData =  this.exampleDatabase.data.slice().filter((issue: PromotionUser) => {
          const searchStr = (issue.id + issue.name + issue.mobile_no + issue.created_at + issue.description).toLowerCase();
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
    this.exampleDatabase.getPromotionUserList(pageNumber);
  }

  /* Redeem Coupon */
  redeemCoupon(index){
    this.exampleDatabase.redeemCoupon(index)
  }

  //Apply Filter
  applyFilter(){
    this.exampleDatabase.getPromotionUserList(this.exampleDatabase.page);
  }

  //Clear Filter
  clearFilter(){
    this.exampleDatabase.getPromotionUserList(this.exampleDatabase.page);
  }

  disconnect() {}

  /** Returns a sorted copy of the database data. */
  sortData(data: PromotionUser[]): PromotionUser[] {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string | Date = '';
      let propertyB: number | string | Date = '';
    
      switch (this.sort.active) {
        case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
        case 'name': [propertyA, propertyB] = [a.name, b.name]; break;
        case 'mobile_no': [propertyA, propertyB] = [a.mobile_no, b.mobile_no]; break;
        case 'created_at': [propertyA, propertyB] = [a.created_at, b.created_at]; break;
        case 'description': [propertyA, propertyB] = [a.description, b.description]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this.sort.direction === 'asc' ? 1 : -1);
    });
  }
}
