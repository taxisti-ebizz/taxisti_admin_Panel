import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import { CurrentDriverIssue } from '../../module/current-driver-issue.module';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpService } from './../http.service';
import { ApiService } from './../api.service'


@Injectable({
  providedIn: 'root'
})
export class CurDriverDataService {

  dataChange : BehaviorSubject<CurrentDriverIssue[]> = new BehaviorSubject<CurrentDriverIssue[]>([]);

  dialogData : any;
  page = 0;
  count = 0;
  total : any;

  constructor(private httpClient : HttpClient,
    private spinner : NgxSpinnerService,
    private http : HttpService,
    private api : ApiService) { }

  get data() : CurrentDriverIssue[] {
    return this.dataChange.value
  }

  deleteDriver(index){
    const foundIndex = this.dataChange.value.findIndex(x => x.id === index);

    this.dataChange.value.splice(foundIndex, 1);
    console.log("dataChange ============>>>>>>>>>",this.dataChange.value);

    this.dataChange.next(this.dataChange.value);
  }

  getCurrentDriverList(page) : void {
    this.spinner.show();

    const data = {
      "page" : page,
      "type" : "current"
    }

    const headers : HttpHeaders = new HttpHeaders({ Authorization : 'Bearer '+localStorage.getItem('token') })
   
    this.httpClient.post<CurrentDriverIssue>(this.http.baseUrl+this.api.getDriverList,data,{ headers }).subscribe(res => {
        const result : any = res;

        var i = 1;
        result.data.data.forEach(element => {
          element.id = i;
          i++;
        });
        
        this.dataChange.next(result.data.data);
        this.total = result.data.total;
        
        this.spinner.hide();
    },
    (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
    });
  }

  // DEMO ONLY, you can find working methods below
  add (data: CurrentDriverIssue): void {
    this.dialogData = data;
  }

  update (data: CurrentDriverIssue): void {
    this.dialogData = data;
  }

  delete (id: number): void {
    console.log(id);
  }

  getDialogData() {
    return this.dialogData;
  }
}
