import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {UserIssue} from '../../core/e-commerce/_models/user-issue.module';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

    private readonly API_URL = 'http://3.20.203.125/api/api/getUserList'

    dataChange: BehaviorSubject<UserIssue[]> = new BehaviorSubject<UserIssue[]>([]);
    // Temporarily stores data from dialogs
    dialogData: any;

    constructor (private httpClient: HttpClient) {}

    get data(): UserIssue[] {
      return this.dataChange.value;
    }

    getDialogData() {
      return this.dialogData;
    }

    getAllIssues(page): void {

      const data = {
        "page" : page
      }
      const headers : HttpHeaders = new HttpHeaders({ Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI1IiwianRpIjoiOWM1NmI2ZDQ0ZmI0MTE3OTk0NzJkYTE1NjE4M2Y3ZjRjYmY4MjYwZDc2OTM5MmJjYjk3NmRlMzk1MTVkNjZhYzRhMmU1YzM4NDlmYTU0NmUiLCJpYXQiOjE1ODc2OTk0ODMsIm5iZiI6MTU4NzY5OTQ4MywiZXhwIjoxNjE5MjM1NDgzLCJzdWIiOiI1NiIsInNjb3BlcyI6W119.xpauElNSmvkoQ1CFJPEWHVGYZJgKC_cIWWPksbAs5E4L-FVnwcbyYlnDPPImoOqFF_rUu1IrjG14Rb_NAfv5Xge0Gs4ocMnzDPyT-exUZy0WZ5DuTkwRkXINzQDp10-O-Cwq0QCRQEuPnVcSxo8VfnkPLC3JaxJnYQXT6kCqseasAaP7_9eH22JkVUXhg8poF-R_uah4o6xUMhvPEzeQLH72mipZtnTYPr6VhqdbXPdR7tLn0ubtnTgxoDAJ9We5KhYm1cvgNVr1Nc8NOm6wZslQyvaDTBrLKFMPaTnqTWpaf-I5W62nPhG2qxxh4ThjADFU8Nw0FLg4AD6fU_Azr8GRRg5DfsLVV446ETwj8iXGyUSIB7-0nUL9_ROiyUQfK3_LgVlgwr30MX-hf29bveMCxGmefCWksN4s0QK3n6HYt6PjiRWryOwP7knwb6XiwGp6YF1H_wZJQUQq-shkLHH3ZDCe-rJJJist79KioBuXs-i3ksYWx0dHlBM7MYe80_0Fo3bLJA2X0XeUZq1zb3Q5__InW7XGmgfqipJGmRZ_ORTfIW_nOoLEzrjqoBNY5SBeFOj46WIWspMW_2SWAgwqCaYffrG22_PGZfJTWjqi8_JZZSLDNoVKgJQOBrOlZ5cULKmtXF6Fvbcli7v-IqFv1Ty2yBBpnVZX25oFdcM' });
  
  
      this.httpClient.post<UserIssue[]>(this.API_URL, data, { headers }).subscribe(data => {
          const result : any = data;
          var i = 1;
          result.data.data.forEach(element => {
            element.id = i;
            
            i++;
          });
          
        
          this.dataChange.next(result.data.data);
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
