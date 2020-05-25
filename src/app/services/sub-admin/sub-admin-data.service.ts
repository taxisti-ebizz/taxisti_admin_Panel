import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SubAdmin } from '../../module/sub-admin/sub-admin.module';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpService } from './../http.service';
import { ApiService } from './../api.service'

@Injectable({
  providedIn: 'root'
})
export class SubAdminDataService {

  dataChange : BehaviorSubject<SubAdmin[]> = new BehaviorSubject<SubAdmin[]>([]);

  mode = 0;
  obj = {};
  dialogData : any;
  page = 0;
  count = 0;
  total : any;

  constructor(private httpClient : HttpClient,
    private spinner : NgxSpinnerService,
    private http : HttpService,
    private api : ApiService) { }

  get data() : SubAdmin[] {
    return this.dataChange.value
  }

  //Delete Sub Admin
  deleteSubAdmin(index){
    const foundIndex = this.dataChange.value.findIndex(x => x.user_id === index);

    this.dataChange.value.splice(foundIndex, 1);
    
    this.dataChange.next(this.dataChange.value);
  }

  //Get Sub Admin List
  getSubAdminList(page) : void {
    this.spinner.show();

    const data = {
      "page" : page
    }

    const headers : HttpHeaders = new HttpHeaders({ Authorization : 'Bearer '+localStorage.getItem('token') })
   
    this.httpClient.post<SubAdmin>(this.http.baseUrl+this.api.getSubAdminList,data,{ headers }).subscribe(res => {
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
   add (data: SubAdmin): void {
    this.dialogData = data;
  }

  update (data: SubAdmin): void {
    this.dialogData = data;
  }

  delete (id: number): void {
    console.log(id);
  }

  getDialogData() {
    return this.dialogData;
  }
}
