import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { AdminAuthService } from '../helper/admin-auth.service';
import { map, catchError, retry } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HttpService {

    baseUrl = 'http://3.20.203.125/api/';

    constructor(private http: HttpClient, 
        private authService: AdminAuthService,
      ) {     
    }


    //Post Request
    postRequest(url, data) : Observable<any> {
        //this.spinner.show();

        const baseUrl = this.checkPort(url);
        return this.http.post(baseUrl, data).pipe(
            map(
                userData => {
                    return userData;
                }
            ),
        );
    }

    //Get Request
    getRequest(url) {
        const baseUrl = this.checkPort(url);
        return this.http.get(baseUrl);
    }

    //Merge baseUrl + getUrl
    checkPort(url) {
        return this.baseUrl + url;
    }

    //Get Auth Token
    jwtToken(){
        return localStorage.getItem('jwtToken');
    }
}
