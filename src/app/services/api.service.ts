import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

    path = 'api/';

    login = this.path+'adminLogin';
    userList = this.path+'getUserList';
    editUserDetails = this.path+'editUserDetail';
    deleteUser = this.path+'deleteUser/';
    getDriverList = this.path+'getDriverList';

}
