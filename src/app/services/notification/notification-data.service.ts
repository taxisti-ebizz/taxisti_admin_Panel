import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notification } from '../../module/notification/notification.module';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpService } from './../http.service';
import { ApiService } from './../api.service'

@Injectable({
  providedIn: 'root'
})
export class NotificationDataService {

  dataChange : BehaviorSubject<Notification[]> = new BehaviorSubject<Notification[]>([]);

  dialogData : any;
  page = 0;
  count = 0;
  total : any;

  constructor(private httpClient : HttpClient,
    private spinner : NgxSpinnerService,
    private http : HttpService,
    private api : ApiService) { }

  get data() : Notification[] {
    return this.dataChange.value
  }

  //Get Pending Ride Data
  getSpecificUserList(page) : void {
    this.spinner.show();

    const data = {
      "page" : page
    }

    const headers : HttpHeaders = new HttpHeaders({ Authorization : 'Bearer '+localStorage.getItem('token') })
  
    this.httpClient.post<Notification>(this.http.baseUrl+this.api.getSpecificUserList ,data, { headers }).subscribe(res => {
        const result : any = res;

        if(result.status == true){

          if(Object.keys(result.data).length > 0 && result.data.constructor === Object){
            var i = 1;
            result.data.data.forEach(element => {
              element.index = i;
              i++;
            });

            
            this.total = result.data.total;
            setTimeout(() => {
              this.dataChange.next(result.data.data);
              this.spinner.hide();
            }, 500);
          }
        }
        else{
          this.total = 0;
          setTimeout(() => {
            this.dataChange.next([]);
            this.spinner.hide();
          }, 500);
        }
    },
    (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
    });
  }

  getDialogData() {
    return this.dialogData;
  }
}
