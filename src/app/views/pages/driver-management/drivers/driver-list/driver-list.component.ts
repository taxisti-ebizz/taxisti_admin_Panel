import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table'; 

//Http API Method
import { HttpService } from '../../../../../services/http.service';

//API
import { ApiService } from '../../../../../services/api.service';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { SubheaderService } from '../../../../../core/_base/layout';

// Models
import { UserDeleted, User } from '../../../../../core/auth';

// Services
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../../../core/_base/crud';

//Edit User Modal
import { DriverEditComponent } from '../driver-edit/driver-edit.component';

//View User details
import { ViewDriverDetailsComponent } from '../view-driver-details/view-driver-details.component';

// Edit User Service
import { EditDriverService } from '../../../../../services/driver/edit-driver.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';

@Component({
  selector: 'kt-driver-list',
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.scss']
})
export class DriverListComponent implements OnInit {

    displayedColumns = ['id', 'username', 'mobile_no', 'rides', 'cancelled_ride', 'acceptance_ratio', 'rejected_ratio', 'last_week_online_hours', 'current_week_online_hours', 'total_online_hours', 'total_reviews', 'average_rating', 'date_of_birth', 'date_of_register', 'device_type', 'verify', 'actions'];

    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

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
      private store: Store<AppState>) { }

    ngOnInit() {
        // Set title to page breadCrumbs
        this.subheaderService.setTitle('Driver Management');

        this.allDriverList();
    }

    //Get all drivers
    allDriverList(){

      const data = {
				"page":this.page,
				"type":"all"
			}

      this.http.postReq(this.api.getDriverList,data).subscribe(res => {
        const result : any = res;
        if(result.status == true){
          this.count = result.data.total;

					var i = 1;
					result.data.data.forEach(element => {
						element.id = i;
						i++;
					});
					
					this.loadData(result.data);
        }
      })
    }

    //Load driver data
    loadData(data){
    
      this.dataSource = new MatTableDataSource(data.data);
      this.paginator = this.paginator;
      this.sort = this.sort;
      this.spinner.hide();
      
    }

    //Handle Page
    handlePage(event){
      this.page = event;
      this.allDriverList();
    }

    /*
      Edit Driver detail
    */
    editDriver(driverData) {
      this.editDriverService.obj = driverData;
      this.editDriverService.mode = 2;

      const dialogRef = this.dialog.open(DriverEditComponent, {
        width: '800px',
        height: 'auto',
        backdropClass: 'masterModalPopup',
        data: { mode: 2, driver : driverData }
      });
      dialogRef.afterClosed().subscribe(result => {
        
        if (result === "close" || result === undefined) {
          this.allDriverList();
          
        } else if (result === false) {
          this.spinner.hide();
        }
      });
    }

    // Vew Driver Details
    viewDriverDetails(driverData){
      this.editDriverService.obj = driverData;
      this.editDriverService.mode = 3;

      const dialogRef = this.dialog.open(ViewDriverDetailsComponent, {
        width: '700px',
        height: 'auto',
        backdropClass: 'masterModalPopup',
        data: { mode: 3, driverData : driverData }
      });
      dialogRef.afterClosed().subscribe(result => {
        
        if (result === "close" || result === undefined) {
          this.allDriverList();
          
        } else if (result === false) {
          this.spinner.hide();
        }
      });
    }

    //Verify Driver
    verifyDriver(driverId,status){
      var _title = '';
      var _description = '';
      var _waitDesciption = '';
      var _deleteMessage = '';
      if(status == 0){
        _title = 'Driver Unapprove';
        _description = 'Are you sure want to Unapprove?';
        _waitDesciption = 'Driver is unapproving...';
        _deleteMessage = `Driver has been Unapproved`;
      }else{
        _title = 'Driver Approve';
        _description = 'Are you sure want to Approve?';
        _waitDesciption = 'Driver is aprroving...';
        _deleteMessage = `Driver has been Approve`;
      }

      const dialogRef = this.layoutUtilsService.verifyElement(_title, _description, _waitDesciption, driverId, status, 'driver');
      dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          return;
        }

        this.store.dispatch(new UserDeleted({ id: driverId }));
        this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
        this.allDriverList();
      });
    }
    
    //Driver list search filter
    applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }

    //Delete Driver 
    deleteDriver(_item: User) {
      
      const _title = 'Delete Driver';
      const _description = 'Are you sure to permanently delete this driver?';
      const _waitDesciption = 'Driver is deleting...';
      const _deleteMessage = `Driver has been deleted`;
  
      const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption, _item, 'driver');
      dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          return;
        }
  
        this.store.dispatch(new UserDeleted({ id: _item.id }));
        this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
        setTimeout(() => {
            this.allDriverList();
        }, 1000);
      });
    }

}
