import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {DriverIssue} from '../../module/driver-issue.module';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpService } from './../http.service';
import { ApiService } from './../api.service'

@Injectable({
  providedIn: 'root'
})
export class AllDriverDataService {

  dataChange : BehaviorSubject<DriverIssue[]> = new BehaviorSubject<DriverIssue[]>([]);

  dialogData : any;
  page = 0;
  count = 0;
  total : any;

  constructor(private httpClient : HttpClient,
    private spinner : NgxSpinnerService,
    private http : HttpService,
    private api : ApiService) { }

  get data() : DriverIssue[] {
    return this.dataChange.value
  }

  deleteDriver(index){
    const foundIndex = this.dataChange.value.findIndex(x => x.id === index);

    this.dataChange.value.splice(foundIndex, 1);
    console.log("dataChange ============>>>>>>>>>",this.dataChange.value);

    this.dataChange.next(this.dataChange.value);
  }

  //Get All Driver List
  getAllDriverList(page) : void {
    this.spinner.show();

    var urlType = 'all';
    if(localStorage.getItem('urlType')=='currentweek'){
      urlType = 'currentWeek';
    }
    else if(localStorage.getItem('urlType')=='lastweek'){
      urlType = 'lastWeek';
    }

    const data = {
      "page" : page,
      "type" : urlType
    }

    const headers : HttpHeaders = new HttpHeaders({ Authorization : 'Bearer '+localStorage.getItem('token') })
   
    this.httpClient.post<DriverIssue>(this.http.baseUrl+this.api.getDriverList,data,{ headers }).subscribe(res => {
        const result : any = res;
        if(result.status == true){
          var i = 1;
          result.data.data.forEach(element => {
            element.id = i;
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

  //Get All Driver List With Filter
  getAllDriverListWithFilter(page): void {
    this.spinner.show();

    const data = {
      "page" : page,
      "type" : 'filter',
      "filter" : localStorage.getItem('driverFilter')!=null?localStorage.getItem('driverFilter'):''
    }

    const headers : HttpHeaders = new HttpHeaders({ Authorization : 'Bearer '+localStorage.getItem('token') })
   
    this.httpClient.post<DriverIssue>(this.http.baseUrl+this.api.getDriverList,data,{ headers }).subscribe(res => {
        const result : any = res;
        if(result.status == true){
          var i = 1;
          result.data.data.forEach(element => {
            element.id = i;
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
  add (data: DriverIssue): void {
    this.dialogData = data;
  }

  update (data: DriverIssue): void {
    this.dialogData = data;
  }

  delete (id: number): void {
    console.log(id);
  }

  getDialogData() {
    return this.dialogData;
  }

}
