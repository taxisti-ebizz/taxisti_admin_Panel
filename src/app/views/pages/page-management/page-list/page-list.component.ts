import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

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
import { PageDataService } from '../../../../services/page/page-data.service';

//Component
import { AddPageComponent } from '../add-page/add-page.component';
import { EditPageComponent } from '../edit-page/edit-page.component';

import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
import { DataSource } from '@angular/cdk/collections';
import { Page } from '../../../../module/page/page.module';
import { BehaviorSubject, fromEvent, Observable, merge } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'kt-page-list',
  templateUrl: './page-list.component.html',
  styleUrls: ['./page-list.component.scss']
})
export class PageListComponent implements OnInit {

  displayedColumns = ['id', 'page_title', 'page_slug', 'created_date', 'actions'];

  exampleDatabase : PageDataService | null;
  dataSource : ExampleDataSource | null;
  index: number;
  id: number;
  pageData : any

  //dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', {static: true}) filter: ElementRef;


  constructor(private http: HttpService,
    private api: ApiService,
    private spinner: NgxSpinnerService,
    private subheaderService: SubheaderService,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private store: Store<AppState>,
    private httpClient : HttpClient,
    public pageDataService : PageDataService) { }

  ngOnInit() {
    // Set title to page breadCrumbs
    this.subheaderService.setTitle('Page Management');
    this.pageData = Page;
    this.getPageData();
  }

  //Get Page Data
  getPageData(){
    this.exampleDatabase = new PageDataService(this.httpClient,this.spinner,this.http,this.api);
    this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);
    // fromEvent(this.filter.nativeElement, 'keyup')
    // .subscribe(() => {
    //   if (!this.dataSource) {
    //     return;
    //   }
    //   this.dataSource.filter = this.filter.nativeElement.value;
    // })
  }

  //Page list search filter
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //Handle Page
  handlePage(event){
    this.pageDataService.page = event;
    this.dataSource.changePage(event);
  }

  /*
    Add Page detail
  */
  addPage() {

    const dialogRef = this.dialog.open(AddPageComponent, {
      width: '1000px',
      height: 'auto',
      backdropClass: 'masterModalPopup',
      data: { page : this.pageData }
    });

    dialogRef.afterClosed().subscribe(result => {

      if(result != 2){
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside DataService
        this.exampleDatabase.dataChange.value.push(this.pageDataService.getDialogData());
        this.getPageData();
      }
    });
  }  

  /*
    Edit Page detail
  */
  editPageDetail(i: number, pageData) {
      
    this.pageDataService.obj = pageData
    this.pageDataService.mode = 2

    this.id = pageData.id;
    // index row is used just for debugging proposes and can be removed
    this.index = i;
    const dialogRef = this.dialog.open(EditPageComponent, {
      width: '1000px',
      height: 'auto',
      backdropClass: 'masterModalPopup',
      data: { pageData : pageData }
    });

    dialogRef.afterClosed().subscribe(result => {
      
      if (result != 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
        // Then you update that record using data from dialogData (values you enetered)
        this.exampleDatabase.dataChange.value[foundIndex] = this.pageDataService.getDialogData();
      }
    });
  }

  /**
   * Delete Page Data
  */
  deletePage(page_id){
    const _title = 'Delete Page';
    const _description = 'Are you sure to permanently delete this page?';
    const _waitDesciption = 'Page is deleting...';
    const _deleteMessage = 'Page has been deleted';

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption, page_id, 'deletePage');
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this.dataSource.deleteItem(page_id)
          
      this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
    });
  } 

}


//DataSource ===============================
export class ExampleDataSource extends DataSource<Page>{
  _filterChange = new BehaviorSubject('');

  pageSize = 10

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: Page[] = [];
  renderedData: Page[] = [];
  public totalPage = 0;

  constructor(public exampleDatabase: PageDataService,
              public paginator: MatPaginator,
              public sort: MatSort) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Page[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this.sort.sortChange,
      this._filterChange,
      //this.paginator.page
    ];

    this.exampleDatabase.getPageList(this.exampleDatabase.page);


    return merge(...displayDataChanges).pipe(map( (res) => {
        // Filter data

        this.totalPage = this.exampleDatabase.total //result.total;

        this.filteredData =  this.exampleDatabase.data.slice().filter((issue: Page) => {
          const searchStr = (issue.id + issue.page_title + issue.page_slug + issue.created_date).toLowerCase();
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
    
    this.exampleDatabase.getPageList(pageNumber);
  }

  /* Delete Item From List */
  deleteItem(index){
    this.exampleDatabase.deleteContact(index)
  }

  disconnect() {}

  /** Returns a sorted copy of the database data. */
  sortData(data: Page[]): Page[] {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string | Date = '';
      let propertyB: number | string | Date = '';
    

      switch (this.sort.active) {
        case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
        case 'page_title': [propertyA, propertyB] = [a.page_title, b.page_title]; break;
        case 'page_slug': [propertyA, propertyB] = [a.page_slug, b.page_slug]; break;
        case 'created_date': [propertyA, propertyB] = [a.created_date, b.created_date]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this.sort.direction === 'asc' ? 1 : -1);
    });
  }
}
