import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DriverReview } from '../../module/review/driver-review.module';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpService } from './../http.service';
import { ApiService } from './../api.service'

@Injectable({
  providedIn: 'root'
})
export class DriverReviewDataService {

  dataChange : BehaviorSubject<DriverReview[]> = new BehaviorSubject<DriverReview[]>([]);

  mode: number;
  obj: any;
  dialogData : any;
  page = 0;
  count = 0;
  total : any;

  constructor(private httpClient : HttpClient,
    private spinner : NgxSpinnerService,
    private http : HttpService,
    private api : ApiService) { }

  get data() : DriverReview[] {
    return this.dataChange.value
  }

  //Get Driver Review Data
  getDriverReviewList(page) : void {
    this.spinner.show();

    const data = {
      "page" : page
    }

    const headers : HttpHeaders = new HttpHeaders({ Authorization : 'Bearer '+localStorage.getItem('token') })
   
    this.httpClient.post<DriverReview>(this.http.baseUrl+this.api.getDriverReviews,data,{ headers }).subscribe(res => {
        const result : any = res;

        if(result.status == true){

          if(Object.keys(result.data).length > 0 && result.data.constructor === Object){
            var i = 1;
            result.data.data.forEach(element => {
              element.index = i;
              i++;
            });

            this.total = result.data.total;
            this.dataChange.next(result.data.data);
          }
        }

        this.spinner.hide();
    },
    (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
    });
  }
}
