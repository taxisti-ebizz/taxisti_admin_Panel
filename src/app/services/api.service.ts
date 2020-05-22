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

    //Reviews
    getDriverReviews = this.path+'getDriverReviews';
    getRiderReviews = this.path+'getRiderReviews';
    viewDriverReviews = this.path+'viewDriverReviews';
    viewRiderReviews = this.path+'viewRiderReviews';

    //Ride Area Setting
    getRideAreaList = this.path+'getRideAreaList';
    addAreaBoundaries = this.path+'addAreaBoundaries';
    viewAreaBoundaries = this.path+'viewAreaBoundaries';
    deleteAreaBoundaries = this.path+'deleteAreaBoundaries/';

    //Promotion
    getPromotionList = this.path+'getPromotionList';
    updatePromotionDetail = this.path+'updatePromotionDetail';
    deletePromotion = this.path+'deletePromotion/';
    addPromotion = this.path+'addPromotion';

    //Promotion User List
    getUserPromotionList = this.path+'getUserPromotionList';
    redeemPromotionList = this.path+'redeemPromotionList';

    //Options
    getOptionsDetail = this.path+'getOptions';
    updateOptions = this.path+'updateOptions';

    //Send Notification
    sendNotification = this.path+'sendNotification';
    getSpecificUserList = this.path+'getSpecificUserList';

    //Contact Us
    getContactUsList = this.path+'getContactUsList';
    viewContactUsMessage = this.path+'viewContactUsMessage';
    deleteContactUs = this.path+'deleteContactUs/'

    //Page
    getPageList = this.path+'getPageList';
    addPage = this.path+'addPage';
    editPage = this.path+'editPage';
    deletePage = this.path+'deletePage/';

    //Sub Admin
    getSubAdminList = this.path+'getSubAdminList';
    updateSubAdminStatus = this.path+'updateSubAdminStatus';
    addSubAdmin = this.path+'addSubAdmin';
    deleteSubAdmin = this.path+'deleteSubAdmin/';

    //Log Details
    getDriverOnlineLog = this.path+'getDriverOnlineLog';

    //Update Admin Profile
    updateAdminProfile = this.path+'updateAdminProfile';
    
}
