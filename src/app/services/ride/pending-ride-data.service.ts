import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import { PendingRideIssue } from '../../module/pending-ride-issue.module';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpService } from './../http.service';
import { ApiService } from './../api.service'

@Injectable({
  providedIn: 'root'
})
export class PendingRideDataService {

  dataChange : BehaviorSubject<PendingRideIssue[]> = new BehaviorSubject<PendingRideIssue[]>([]);

  dialogData : any;
  page = 0;
  count = 0;
  total : any;
  mode : any;
  formData = {};

  constructor(private httpClient : HttpClient,
    private spinner : NgxSpinnerService,
    private http : HttpService,
    private api : ApiService) { }

  get data() : PendingRideIssue[] {
    return this.dataChange.value
  }

  //Delete single ride
  deletePendingRide(index){
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

  //Get Pending Ride Data
  getPendingRideList(page) : void {
    this.spinner.show();

    var urlType = 'All';
    if(localStorage.getItem('urlType')=='currentweek'){
      urlType = 'currentWeek';
    }
    else if(localStorage.getItem('urlType')=='lastweek'){
      urlType = 'lastWeek';
    }

    var data = {};
    if(localStorage.getItem('ridesFilter')!=null && localStorage.getItem('ridesFilter')!=''){
      data = {
        "page" : page,
        "type" : urlType,
        "sub_type" : 'filter',
        "filter" : localStorage.getItem('ridesFilter')
      }
    }else{
      data = {
        "page" : page,
        "type" : urlType
      }
    }

    const headers : HttpHeaders = new HttpHeaders({ Authorization : 'Bearer '+localStorage.getItem('token') })
   
    this.httpClient.post<PendingRideIssue>(this.http.baseUrl+this.api.getPendingRideList,data,{ headers }).subscribe(res => {
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
  add (data: PendingRideIssue): void {
    this.dialogData = data;
  }

  update (data: PendingRideIssue): void {
    this.dialogData = data;
  }

  delete (id: number): void {
    console.log(id);
  }

  getDialogData() {
    return this.dialogData;
  }
}
