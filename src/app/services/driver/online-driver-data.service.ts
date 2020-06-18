import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import { OnlineDriverIssue } from '../../module/online-driver-issue.module';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpService } from './../http.service';
import { ApiService } from './../api.service'

@Injectable({
  providedIn: 'root'
})
export class OnlineDriverDataService {

  dataChange : BehaviorSubject<OnlineDriverIssue[]> = new BehaviorSubject<OnlineDriverIssue[]>([]);

  dialogData : any;
  page = 0;
  count = 0;
  total : any;
  mode : any;
  formData = {};
  type : any;

  constructor(private httpClient : HttpClient,
    private spinner : NgxSpinnerService,
    private http : HttpService,
    private api : ApiService) { }

  get data() : OnlineDriverIssue[] {
    return this.dataChange.value
  }

  deleteOnlineDriver(index){
    const foundIndex = this.dataChange.value.findIndex(x => x.id === index);

    this.dataChange.value.splice(foundIndex, 1);
    
    this.dataChange.next(this.dataChange.value);
  }

  //Get Online Driver List Data
  getOnlineDriverList(page) : void {
    this.spinner.show();

    var data = {};
    if(localStorage.getItem('driverFilter')!=null && localStorage.getItem('driverFilter')!=''){
      data = {
        "page" : page,
        "type" : "online",
        "sub_type" : "filter",
        "filter" : localStorage.getItem('driverFilter')
      }
    }else{
      data = {
        "page" : page,
        "type" : 'online'
      }
    }

    const headers : HttpHeaders = new HttpHeaders({ Authorization : 'Bearer '+localStorage.getItem('token') })
   
    this.httpClient.post<OnlineDriverIssue>(this.http.baseUrl+this.api.getDriverList,data,{ headers }).subscribe(res => {
      const result : any = res;

      if(result.status == true){
        var i = 1;
        result.data.data.forEach(element => {
          element.id = i;

          element.driver_avg = 0;
          if(element.driver_avg_rating.length > 0){
            element.driver_avg = element.driver_avg_rating[0].avg;
          }

          element.online_hours_current_week_count = '00:00:00';
          if(element.online_hours_current_week.length > 0){
            element.online_hours_current_week_count = element.online_hours_current_week[0].time;
          }

          element.online_hours_last_week_count = '00:00:00';
          if(element.online_hours_last_week.length > 0){
            element.online_hours_last_week_count = element.online_hours_last_week[0].time;
          }

          element.total_online_hours_count = '00:00:00';
          if(element.total_online_hours.length > 0){
            element.total_online_hours_count = element.total_online_hours[0].time;
          }

          i++;
        });
        
        this.total = result.data.total;
        setTimeout(() => {
          this.dataChange.next(result.data.data);
          this.spinner.hide();
        }, 500);
        
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

  // DEMO ONLY, you can find working methods below
  add (data: OnlineDriverIssue): void {
    this.dialogData = data;
  }

  update (data: OnlineDriverIssue): void {
    this.dialogData = data;
  }

  delete (id: number): void {
    console.log(id);
  }

  getDialogData() {
    return this.dialogData;
  }
}
