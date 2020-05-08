import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CanceledRide } from '../../module/canceled-ride.module';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpService } from './../http.service';
import { ApiService } from './../api.service'


@Injectable({
  providedIn: 'root'
})
export class CanceledRideDataService {

    dataChange : BehaviorSubject<CanceledRide[]> = new BehaviorSubject<CanceledRide[]>([]);

    dialogData : any;
    page = 0;
    count = 0;
    total : any;

    constructor(private httpClient : HttpClient,
      private spinner : NgxSpinnerService,
      private http : HttpService,
      private api : ApiService) { }

    get data() : CanceledRide[] {
      return this.dataChange.value
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
    getCanceledRideList(page) : void {
      this.spinner.show();

      const data = {
        "page" : page
      }

      const headers : HttpHeaders = new HttpHeaders({ Authorization : 'Bearer '+localStorage.getItem('token') })
    
      this.httpClient.post<CanceledRide>(this.http.baseUrl+this.api.getCanceledRideList ,data, { headers }).subscribe(res => {
          const result : any = res;

          if(result.status == true){

            if(Object.keys(result.data).length > 0 && result.data.constructor === Object){
              var i = 1;
              result.data.data.forEach(element => {
                element.index = i;
                if(element.cancel_by == 1){
                  element.cancel_by_name = 'Driver';
                }
                else if(element.cancel_by == 2){
                  element.cancel_by_name = 'Rider';
                }
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

    // DEMO ONLY, you can find working methods below
    add (data: CanceledRide): void {
      this.dialogData = data;
    }

    update (data: CanceledRide): void {
      this.dialogData = data;
    }

    delete (id: number): void {
      console.log(id);
    }

    getDialogData() {
      return this.dialogData;
    }
}