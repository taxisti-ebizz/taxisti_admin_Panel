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

// Edit User Service
import { EditUserService } from '../../../../../services/user/edit-user.service';

//Edit User Modal
import { EditUserComponent } from '../edit-user/edit-user.component';

//View User details
import { ViewUserDetailsComponent } from '../view-user-details/view-user-details.component';

import { Store } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';

@Component({
  selector: 'kt-all-users-list',
  templateUrl: './all-users-list.component.html',
  styleUrls: ['./all-users-list.component.scss']
})
export class AllUsersListComponent implements OnInit {

    //dataSource: UsersDataSource;
    displayedColumns = ['id', 'username', 'mobile_no', 'completed_ride', 'cancelled_ride', 'total_reviews', 'average_rating', 'date_of_birth', 'date_of_register', 'device_type', 'verify', 'actions'];
	

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
      private editUserService : EditUserService,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private store: Store<AppState>) { }

    ngOnInit() {
      // Set title to page breadCrumbs
      this.subheaderService.setTitle('User Management');

      this.allUserList();
    }

    //Get User List
    allUserList(){
      
      const data = {
        "page":this.page,
      }

      this.http.postReq(this.api.userList,data).subscribe(res => {
        const result: any = res;
        if (result.status == true) {
          this.count = result.data.total;

          var i = 1;
          result.data.data.forEach(element => {
            element.id = i;
            i++;
          });
          
          this.loadData(result.data);
        }
      });
    }
    
    //Load User Data
    loadData(data) {
        this.dataSource = new MatTableDataSource(data.data);
        this.paginator = this.paginator;
        this.sort = this.sort;
        setTimeout(() => {
          this.spinner.hide();
        }, 1000);
        
    }
  
    //User list search filter
    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
    }

    //Handle Page
    handlePage(event){
        this.page = event;
        this.allUserList();
    }

    /*
      Edit user details
    */
    editUser(user) {
      this.editUserService.obj = user;
      this.editUserService.mode = 2;

      const dialogRef = this.dialog.open(EditUserComponent, {
        width: '700px',
        height: 'auto',
        backdropClass: 'masterModalPopup',
        data: { mode: 2, first_name : user.first_name, last_name : user.last_name, profile_pic : user.profile_pic, user_id : user.user_id }
      });
      dialogRef.afterClosed().subscribe(result => {
        
        if (result === "close" || result === undefined) {
          this.allUserList();
          
        } else if (result === false) {
          this.spinner.hide();
        }
      });
    }

    //View User Details
    viewUser(userData){
      this.editUserService.obj = userData;
      this.editUserService.mode = 3;

      const dialogRef = this.dialog.open(ViewUserDetailsComponent, {
        width: '700px',
        height: 'auto',
        backdropClass: 'masterModalPopup',
        data: { mode: 3, userData : userData }
      });
      dialogRef.afterClosed().subscribe(result => {
        
        if (result === "close" || result === undefined) {
          this.allUserList();
          
        } else if (result === false) {
          this.spinner.hide();
        }
      });
    }

    //Verify User 
    verifyUser(userId,status){
      var _title = '';
      var _description = '';
      var _waitDesciption = '';
      var _deleteMessage = '';
      if(status == 0){
        _title = 'User Unapprove';
        _description = 'Are you sure want to Unapprove?';
        _waitDesciption = 'User is unapproving...';
        _deleteMessage = `User has been Unapproved`;
      }else{
        _title = 'User Approve';
        _description = 'Are you sure want to Approve?';
        _waitDesciption = 'User is aprroving...';
        _deleteMessage = `User has been Approve`;
      }

      const dialogRef = this.layoutUtilsService.verifyElement(_title, _description, _waitDesciption, userId, status);
      dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          return;
        }

        this.store.dispatch(new UserDeleted({ id: userId }));
        this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
      });
    }

    //Delete USer
    deleteUser(_item: User) {
      const _title = 'User Delete';
      const _description = 'Are you sure to permanently delete this user?';
      const _waitDesciption = 'User is deleting...';
      const _deleteMessage = `User has been deleted`;
  
      const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption, _item);
      dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          return;
        }
  
        this.store.dispatch(new UserDeleted({ id: _item.id }));
        this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
      });
    }
}
