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

  constructor(private httpClient : HttpClient,
    private spinner : NgxSpinnerService,
    private http : HttpService,
    private api : ApiService) { }

  get data() : PendingRideIssue[] {
    return this.dataChange.value
  }

  deletePendingRide(index){
    const foundIndex = this.dataChange.value.findIndex(x => x.id === index);

    this.dataChange.value.splice(foundIndex, 1);
    
    this.dataChange.next(this.dataChange.value);
  }

  getPendingRideList(page) : void {
    this.spinner.show();

    const data = {
      "page" : page
    }

    const headers : HttpHeaders = new HttpHeaders({ Authorization : 'Bearer '+localStorage.getItem('token') })
   
    this.httpClient.post<PendingRideIssue>(this.http.baseUrl+this.api.getPendingRideList,data,{ headers }).subscribe(res => {
        const result : any = res;

        if(result.status == true){

          if(result.data.length > 0){
            var i = 1;
            result.data.data.forEach(element => {
              element.id = i;
              i++;
            });
          
            this.dataChange.next(result.data.data);
            this.total = result.data.total;
          }
        }

        this.spinner.hide();
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
