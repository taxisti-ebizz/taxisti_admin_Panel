import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {

    constructor() { }


    getToken(){
      return localStorage.getItem('token');
    }

    loggedIn(){
      if(localStorage.getItem('token')){
        return true;
      }
      else{
        return false;
      }
    }

    getUserId() {
        return localStorage.getItem('userId'); 
    }
}
