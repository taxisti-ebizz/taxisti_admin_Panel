import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table'; 

//Http API Method
import { HttpService } from '../../../../../services/http.service';

//API
import { ApiService } from '../../../../../services/api.service';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { SubheaderService } from '../../../../../core/_base/layout';

//Component
import { ViewComponent } from '../view/view.component';

//Service
import { EditDriverService } from '../../../../../services/driver/edit-driver.service'

@Component({
  selector: 'kt-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

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
      public dialog: MatDialog) { }

    ngOnInit() {

        // Set title to page breadCrumbs
    	  this.subheaderService.setTitle('Driver Management');

        this.driverList();
    }

    driverList(){

      const data = {
				"page":this.page,
				"type":"current"
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

    loadData(data){
    
      this.dataSource = new MatTableDataSource(data.data);
      this.paginator = this.paginator;
      this.sort = this.sort;
      //this.filterConfiguration();
      this.spinner.hide();
      
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
      this.page = event;
      this.driverList();
    }

    // Vew Driver Details
    viewDriverDetails(driverData){
      this.editDriverService.obj = driverData;
      this.editDriverService.mode = 3;

      const dialogRef = this.dialog.open(ViewComponent, {
        width: '700px',
        height: 'auto',
        backdropClass: 'masterModalPopup',
        data: { mode: 3, driverData : driverData }
      });
      dialogRef.afterClosed().subscribe(result => {
        
        if (result === "close" || result === undefined) {
          this.driverList();
          
        } else if (result === false) {
          this.spinner.hide();
        }
      });
    }

}
