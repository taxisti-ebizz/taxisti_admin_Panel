import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserIssue } from '../../module/user-issue.module';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpService } from './../http.service';
import { ApiService } from './../api.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

    dataChange: BehaviorSubject<UserIssue[]> = new BehaviorSubject<UserIssue[]>([]);
    // Temporarily stores data from dialogs
    dialogData: any;
    page = 0;
    total : any;

    constructor (private httpClient: HttpClient,
      private spinner : NgxSpinnerService,
      private http : HttpService,
      private api : ApiService) {}  

    get data(): UserIssue[] {
      return this.dataChange.value;
    }

    getDialogData() {
      return this.dialogData;
    }

    //Delete USer
    deleteUser(index){
      const foundIndex = this.dataChange.value.findIndex(x => x.id === index);
  
      this.dataChange.value.splice(foundIndex, 1);
      console.log("dataChange ============>>>>>>>>>",this.dataChange.value);
  
      this.dataChange.next(this.dataChange.value);
    }

    //Get All User List
    getAllUserList(page): void {
      this.spinner.show();

      var urlType = 'All';
      if(localStorage.getItem('urlType')=='currentweek'){
        urlType = 'currentWeek';
      }
      else if(localStorage.getItem('urlType')=='lastweek'){
        urlType = 'lastWeek';
      }

      var data = {};
      if(localStorage.getItem('userFilter')!=null && localStorage.getItem('userFilter')!=''){
        data = {
          "page" : page,
          "type" : urlType,
          "sub_type" : 'filter',
          "filter" : localStorage.getItem('userFilter')
        }
      }else {
        data = {
          "page" : page,
          "type" : urlType
        }
      }

      const headers : HttpHeaders = new HttpHeaders({ Authorization: 'Bearer '+localStorage.getItem('token') });
  
      this.httpClient.post<UserIssue[]>(this.http.baseUrl+this.api.userList, data, { headers }).subscribe(data => {
          const result : any = data;
          var i = 1;
          if(result.status == true){
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
    addIssue (issue: UserIssue): void {
      this.dialogData = issue;
    }
  
    updateIssue (issue: UserIssue): void {
      this.dialogData = issue;
    }
  
    deleteIssue (id: number): void {
      console.log(id);
    }
}
