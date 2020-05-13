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

//Component
import { EditPromotionComponent } from '../edit-promotion/edit-promotion.component'
import { AddPromotionComponent } from '../add-promotion/add-promotion.component'

// Service
import { PromotionDataService } from '../../../../services/promotion/promotion-data.service';

import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
import { DataSource } from '@angular/cdk/collections';
import { Promotion } from '../../../../module/promotion/promotion.module';
import { BehaviorSubject, fromEvent, Observable, merge } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'kt-promotion-list',
  templateUrl: './promotion-list.component.html',
  styleUrls: ['./promotion-list.component.scss']
})
export class PromotionListComponent implements OnInit {

  displayedColumns = ['id', 'promo_image', 'type', 'code', 'user_limit', 'start_date', 'end_date', 'actions'];

  exampleDatabase : PromotionDataService | null;
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
    public promotionDataService : PromotionDataService,
    public promotion : Promotion) { }

  ngOnInit() {
      // Set title to page breadCrumbs
      this.subheaderService.setTitle('Promotion Management');

      this.getPromotionList();
  }

  //Get Promotion List
  getPromotionList(){
    this.exampleDatabase = new PromotionDataService(this.httpClient,this.spinner,this.http,this.api);
    this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);
    fromEvent(this.filter.nativeElement, 'keyup')
    .subscribe(() => {
      if (!this.dataSource) {
        return;
      }
      this.dataSource.filter = this.filter.nativeElement.value;
    })
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
    this.promotionDataService.page = event;
    this.dataSource.changePage(event);
  }

  /**
   * Delete Perticular Promotion
  */
  deletePromotion(promo_id){
    const _title = 'Delete Promotion';
    const _description = 'Are you sure to permanently delete this promotion?';
    const _waitDesciption = 'Promotion is deleting...';
    const _deleteMessage = 'Promotion has been deleted';

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption, promo_id, 'deletePromotion');
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this.dataSource.deleteItem(promo_id)
          
      this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
    });
  } 

  /*
    Add Promotion detail
  */
  addPromotion(promotion : Promotion) {
    
    const dialogRef = this.dialog.open(AddPromotionComponent, {
      data: { promotion : promotion }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside DataService
        this.exampleDatabase.dataChange.value.push(this.promotionDataService.getDialogData());
      }
    });
  }


  /*
    Edit Promotion detail
  */
  editPromotion(i: number, promotionData) {
    
    this.id = promotionData.id;
    // index row is used just for debugging proposes and can be removed
    this.index = i;
    const dialogRef = this.dialog.open(EditPromotionComponent, {
      data: { promoData : promotionData }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
        // Then you update that record using data from dialogData (values you enetered)
        this.exampleDatabase.dataChange.value[foundIndex] = this.promotionDataService.getDialogData();
      }
    });
  }

}

//DataSource ===============================
export class ExampleDataSource extends DataSource<Promotion>{
  _filterChange = new BehaviorSubject('');

  pageSize = 10

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: Promotion[] = [];
  renderedData: Promotion[] = [];
  public totalPromotion = 0;

  constructor(public exampleDatabase: PromotionDataService,
              public paginator: MatPaginator,
              public sort: MatSort) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Promotion[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this.sort.sortChange,
      this._filterChange,
      //this.paginator.page
    ];

    this.exampleDatabase.getPromotionList(this.exampleDatabase.page);

    return merge(...displayDataChanges).pipe(map( (res) => {
        // Filter data

        this.totalPromotion = this.exampleDatabase.total //result.total;

        this.filteredData =  this.exampleDatabase.data.slice().filter((issue: Promotion) => {
          const searchStr = (issue.id + issue.type + issue.code + issue.user_limit + issue.start_date + issue.end_date).toLowerCase();
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
    
    this.exampleDatabase.getPromotionList(pageNumber);
  }

  /* Delete Item From List */
  deleteItem(index){
    this.exampleDatabase.deleteArea(index)
  }

  disconnect() {}

  /** Returns a sorted copy of the database data. */
  sortData(data: Promotion[]): Promotion[] {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string | Date = '';
      let propertyB: number | string | Date = '';
    

      switch (this.sort.active) {
        case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
        case 'type': [propertyA, propertyB] = [a.type, b.type]; break;
        case 'code': [propertyA, propertyB] = [a.code, b.code]; break;
        case 'end_date': [propertyA, propertyB] = [a.user_limit, b.user_limit]; break;
        case 'start_date': [propertyA, propertyB] = [a.start_date, b.start_date]; break;
        case 'end_date': [propertyA, propertyB] = [a.end_date, b.end_date]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this.sort.direction === 'asc' ? 1 : -1);
    });
  }
}
