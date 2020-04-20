import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

    path = 'api/';

    login = this.path+'adminLogin';

    //User
    userList = this.path+'getUserList';
    editUserDetails = this.path+'editUserDetail';
    deleteUser = this.path+'deleteUser/';
    updateUserStatus = this.path+'updateUserStatus';

    //Driver 
    getDriverList = this.path+'getDriverList';
    deleteDriver = this.path+'deleteDriver/';
    updateDriverStatus = this.path+'updateDriverStatus';

}
