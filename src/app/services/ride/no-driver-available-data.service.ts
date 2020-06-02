import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import { NoDriverAvailableRide } from '../../module/no-driver-available-ride.module';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpService } from './../http.service';
import { ApiService } from './../api.service'

@Injectable({
  providedIn: 'root'
})
export class NoDriverAvailableDataService {

  dataChange : BehaviorSubject<NoDriverAvailableRide[]> = new BehaviorSubject<NoDriverAvailableRide[]>([]);

  dialogData : any;
  page = 0;
  count = 0;
  total : any;

  constructor(private httpClient : HttpClient,
    private spinner : NgxSpinnerService,
    private http : HttpService,
    private api : ApiService) { }

  get data() : NoDriverAvailableRide[] {
    return this.dataChange.value
  }

  //Delete single driver 
  deleteDriver(index){
    const foundIndex = this.dataChange.value.findIndex(x => x.id === index);

    this.dataChange.value.splice(foundIndex, 1);
    
    this.dataChange.next(this.dataChange.value);
  }

  // Delete selected rides
  deleteSelectedRides(ids){

    ids.forEach(element => {
      const foundIndex = this.dataChange.value.findIndex(x => x.id === element);

      this.dataChange.value.splice(foundIndex, 1);
      
      this.dataChange.next(this.dataChange.value);
    });

  }

  //Get No Driver Available Data
  getNoDriverAvailableList(page) : void {
    this.spinner.show();

    var urlType = 'All';
    if(localStorage.getItem('urlType')=='currentweek'){
      urlType = 'currentWeek';
    }
    else if(localStorage.getItem('urlType')=='lastweek'){
      urlType = 'lastWeek';
    }

    const data = {
      "page" : page,
      "urlType" : urlType
    }

    const headers : HttpHeaders = new HttpHeaders({ Authorization : 'Bearer '+localStorage.getItem('token') })
   
    this.httpClient.post<NoDriverAvailableRide>(this.http.baseUrl+this.api.getNoDriverAvailableList,data,{ headers }).subscribe(res => {
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

  //Get No Driver Available Data With Filter
  getNoDriverAvailableListWithFilter(page) : void {
    this.spinner.show();

    const data = {
      "page" : page,
      "urlType" : 'filter',
      "filter" : localStorage.getItem('notAvailRidesFilter')!=null?localStorage.getItem('notAvailRidesFilter'):''
    }

    const headers : HttpHeaders = new HttpHeaders({ Authorization : 'Bearer '+localStorage.getItem('token') })
   
    this.httpClient.post<NoDriverAvailableRide>(this.http.baseUrl+this.api.getNoDriverAvailableList,data,{ headers }).subscribe(res => {
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

  // DEMO ONLY, you can find working methods below
  add (data: NoDriverAvailableRide): void {
    this.dialogData = data;
  }

  update (data: NoDriverAvailableRide): void {
    this.dialogData = data;
  }

  delete (id: number): void {
    console.log(id);
  }

  getDialogData() {
    return this.dialogData;
  }
}
