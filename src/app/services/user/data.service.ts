import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {UserIssue} from '../../module/user-issue.module';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
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

    getAllIssues(page): void {
      this.spinner.show();

      const data = {
        "page" : page
      }
      const headers : HttpHeaders = new HttpHeaders({ Authorization: 'Bearer '+localStorage.getItem('token') });
  
      this.httpClient.post<UserIssue[]>(this.http.baseUrl+this.api.userList, data, { headers }).subscribe(data => {
          const result : any = data;
          var i = 1;
          result.data.data.forEach(element => {
            element.id = i;
            
            i++;
          });
          
          this.dataChange.next(result.data);
          this.spinner.hide();
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
