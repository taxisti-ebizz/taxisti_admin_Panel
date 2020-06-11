import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { AdminAuthService } from '../helper/admin-auth.service';
import { map, catchError, retry } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
    providedIn: 'root'
})
export class HttpService {

    //Old URL -> http://3.20.203.125/api/
    public baseUrl = 'http://52.14.94.29/api/'; 
    

    constructor(private http: HttpClient, 
        private authService: AdminAuthService,
        private spinner : NgxSpinnerService
      ) {     
    }


    //Post Request
    postRequest(url, data) : Observable<any> {
        const baseUrl = this.checkPort(url);
        return this.http.post(baseUrl, data).pipe(
            map(
                userData => {
                    return userData;
                }
            ),
        );
    }

    //Post Request with authToken
    postReq(url,data){
        this.spinner.show();

        const baseUrl = this.checkPort(url);
        const headers : HttpHeaders = new HttpHeaders({ Authorization: 'Bearer '+this.authService.getToken() });
            return this.http.post<any>(baseUrl, data, { headers }).pipe(
            map(
                userData => {
                    return userData;
                }
            )
        );
    }

    //Only user for approve / Unapprove User and Driver
    postReqForVerify(url,data){

        const baseUrl = this.checkPort(url);
        const headers : HttpHeaders = new HttpHeaders({ Authorization: 'Bearer '+this.authService.getToken() });
            return this.http.post<any>(baseUrl, data, { headers }).pipe(
            map(
                userData => {
                    return userData;
                }
            )
        );
    }

    //Get Request
    getRequest(url) {
        this.spinner.show();

        const baseUrl = this.checkPort(url);
        return this.http.get(baseUrl);
    }

    //Delete Request
    deleteReq(url) {
        const baseUrl = this.checkPort(url);
        const headers : HttpHeaders = new HttpHeaders({ Authorization: 'Bearer '+this.authService.getToken() });
            return this.http.delete<any>(baseUrl, { headers }).pipe(
            map(
                userData => {
                    return userData;
                }
            )
        );
    }

    //Merge baseUrl + getUrl
    checkPort(url) {
        return this.baseUrl + url;
    }

    //Get Auth Token
    jwtToken(){
        return localStorage.getItem('jwtToken');
    }

    //Get UserDetail
    get getUserDetail(){
        return JSON.parse(localStorage.getItem('userDetail'));
    }
}
