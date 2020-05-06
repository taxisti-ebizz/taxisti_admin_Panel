import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

    path = 'api/management/';

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
    editDriverDetail = this.path+'editDriverDetail';
    deleteCarImage = this.path+'deleteCarImage/';

    //Ride
    getPendingRideList = this.path+'getPendingRideList';
    getRunningRideList = this.path+'getRunningRideList';
    getCompletedRideList = this.path+'getCompletedRideList';
    getNoResponseRideList = this.path+'getNoResponseRideList';
    getCanceledRideList = this.path+'getCanceledRideList';
    getNoDriverAvailableList = this.path+'getNoDriverAvailableList';
    getFakeRideList = this.path+'getFakeRideList';
    completeRide = this.path+'completeRide';
    deleteRide = this.path+'deleteRide';

}
